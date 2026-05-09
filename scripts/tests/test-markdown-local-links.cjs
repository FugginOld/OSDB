#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function listMarkdownFiles() {
  const repoRoot = process.cwd();
  const results = [];

  for (const ent of fs.readdirSync(repoRoot, { withFileTypes: true })) {
    if (!ent.isFile()) continue;
    if (!ent.name.toLowerCase().endsWith('.md')) continue;
    results.push(ent.name);
  }

  const docsRoot = path.join(repoRoot, 'docs');
  if (fs.existsSync(docsRoot) && fs.statSync(docsRoot).isDirectory()) {
    const stack = [docsRoot];
    while (stack.length) {
      const dir = stack.pop();
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          stack.push(full);
          continue;
        }
        if (!entry.isFile()) continue;
        if (!entry.name.toLowerCase().endsWith('.md')) continue;
        results.push(path.relative(repoRoot, full));
      }
    }
  }

  return Array.from(new Set(results)).sort();
}

function stripCodeFencesAndInlineCode(markdown) {
  const lines = markdown.split('\n');
  const kept = [];

  let inFence = false;
  let fenceChar = null;

  for (const line of lines) {
    const fenceMatch = line.match(/^\s*(```|~~~)/);
    if (fenceMatch) {
      const newFence = fenceMatch[1][0];
      if (!inFence) {
        inFence = true;
        fenceChar = newFence;
      } else if (fenceChar === newFence) {
        inFence = false;
        fenceChar = null;
      }
      kept.push('');
      continue;
    }

    if (inFence) {
      kept.push('');
      continue;
    }

    kept.push(line.replace(/`[^`]*`/g, ''));
  }

  return kept.join('\n');
}

function parseInlineLinkTargets(markdown) {
  const targets = [];

  for (let i = 0; i < markdown.length; i += 1) {
    if (markdown[i] !== ']') continue;
    if (markdown[i + 1] !== '(') continue;

    let j = i + 2;
    let depth = 1;
    let inAngle = false;
    let target = '';

    while (j < markdown.length) {
      const ch = markdown[j];

      if (ch === '<') inAngle = true;
      if (ch === '>') inAngle = false;

      if (!inAngle && ch === '(' && markdown[j - 1] !== '\\') depth += 1;
      if (!inAngle && ch === ')' && markdown[j - 1] !== '\\') depth -= 1;

      if (depth === 0) break;
      target += ch;
      j += 1;
    }

    if (depth === 0) {
      targets.push(target.trim());
      i = j;
    }
  }

  return targets;
}

function parseReferenceDefinitionTargets(markdown) {
  const targets = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const m = line.match(/^\s*\[[^\]]+\]:\s*(\S+)(?:\s+["'(].*)?$/);
    if (!m) continue;

    let target = m[1].trim();
    if (target.startsWith('<') && target.endsWith('>')) {
      target = target.slice(1, -1).trim();
    }
    targets.push(target);
  }

  return targets;
}

function normalizeLinkTarget(rawTarget) {
  if (!rawTarget) return null;

  let target = rawTarget.trim();
  if (!target) return null;

  if (target.startsWith('<') && target.endsWith('>')) {
    target = target.slice(1, -1).trim();
  }

  target = target.replace(/\\\)/g, ')').replace(/\\\(/g, '(');
  target = target.replace(/\\/g, '/');

  if (!target) return null;

  if (target.startsWith('#')) return null;
  if (target.startsWith('//')) return null;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(target)) return null;

  const hashIndex = target.indexOf('#');
  if (hashIndex !== -1) target = target.slice(0, hashIndex);
  const queryIndex = target.indexOf('?');
  if (queryIndex !== -1) target = target.slice(0, queryIndex);

  target = target.trim();
  if (!target) return null;

  try {
    target = decodeURIComponent(target);
  } catch {
    // keep raw target if decode fails
  }

  return target;
}

function resolveTargetPath(markdownFile, targetPath) {
  const repoRoot = process.cwd();
  const baseDir = path.dirname(path.resolve(repoRoot, markdownFile));

  if (targetPath.startsWith('/')) {
    return path.resolve(repoRoot, `.${targetPath}`);
  }

  return path.resolve(baseDir, targetPath);
}

function existsWithMdFallback(resolvedPath) {
  if (fs.existsSync(resolvedPath)) return true;

  const ext = path.extname(resolvedPath);
  if (ext) return false;

  if (fs.existsSync(`${resolvedPath}.md`)) return true;
  return false;
}

function isWithinRepoRoot(absPath) {
  const repoRoot = process.cwd();
  const relative = path.relative(repoRoot, absPath);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function main() {
  const files = listMarkdownFiles();
  if (files.length === 0) {
    console.log('OK: no markdown files found for link checking.');
    return;
  }

  const errors = [];

  for (const markdownFile of files) {
    const raw = fs.readFileSync(markdownFile, 'utf8');
    const stripped = stripCodeFencesAndInlineCode(raw);

    const targets = [
      ...parseInlineLinkTargets(stripped),
      ...parseReferenceDefinitionTargets(stripped),
    ];

    for (const rawTarget of targets) {
      const normalized = normalizeLinkTarget(rawTarget);
      if (!normalized) continue;

      const resolved = resolveTargetPath(markdownFile, normalized);

      if (!isWithinRepoRoot(resolved)) {
        errors.push({
          markdownFile,
          target: rawTarget,
          resolved,
          reason: 'resolves outside repo',
        });
        continue;
      }

      if (!existsWithMdFallback(resolved)) {
        errors.push({
          markdownFile,
          target: rawTarget,
          resolved,
          reason: 'missing file',
        });
      }
    }
  }

  if (errors.length === 0) {
    console.log(`OK: ${files.length} markdown file(s) checked; no broken local links found.`);
    return;
  }

  console.error(`ERROR: ${errors.length} broken local markdown link(s) found:`);
  for (const err of errors) {
    console.error(`- ${err.markdownFile}: ${err.target} -> ${path.relative(process.cwd(), err.resolved)} (${err.reason})`);
  }
  process.exitCode = 1;
}

main();
