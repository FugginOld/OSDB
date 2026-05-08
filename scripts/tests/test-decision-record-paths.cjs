#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..', '..');
const canonicalDir = 'docs/decisions/';
const deprecatedDir = 'docs/adr/';
const selfRel = path.relative(repoRoot, __filename).split(path.sep).join('/');

function listTrackedFiles() {
  const out = execFileSync('git', ['-C', repoRoot, 'ls-files'], { encoding: 'utf8' });
  return out
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function isBinaryBuffer(buf) {
  // Heuristic: if NUL byte exists, treat as binary.
  return buf.includes(0);
}

function shouldSkipFile(filePath) {
  const lower = filePath.toLowerCase();
  return (
    lower.endsWith('.png') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.gif') ||
    lower.endsWith('.webp') ||
    lower.endsWith('.ico') ||
    lower.endsWith('.pdf')
  );
}

function findFirstMatchLine(text, needle) {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(needle)) return { line: i + 1, preview: lines[i].trim() };
  }
  return null;
}

function main() {
  const canonicalPath = path.join(repoRoot, canonicalDir);
  if (!fs.existsSync(canonicalPath)) {
    console.error(`FAIL: missing canonical decision-record directory: ${canonicalDir}`);
    process.exit(1);
  }

  const tracked = listTrackedFiles();

  const offenders = [];
  for (const rel of tracked) {
    if (rel === selfRel) continue;
    if (shouldSkipFile(rel)) continue;
    const abs = path.join(repoRoot, rel);
    if (rel.startsWith(deprecatedDir)) {
      if (!fs.existsSync(abs)) continue;
      offenders.push({ file: rel, reason: `tracked file under deprecated directory ${deprecatedDir}` });
      continue;
    }
    let buf;
    try {
      buf = fs.readFileSync(abs);
    } catch {
      continue;
    }
    if (isBinaryBuffer(buf)) continue;

    const text = buf.toString('utf8');
    if (!text.includes(deprecatedDir)) continue;
    const loc = findFirstMatchLine(text, deprecatedDir);
    offenders.push({
      file: rel,
      reason: `references deprecated path ${deprecatedDir}`,
      line: loc ? loc.line : null,
      preview: loc ? loc.preview : null,
    });
  }

  if (offenders.length > 0) {
    console.error(`FAIL: found deprecated decision-record path ${deprecatedDir}`);
    for (const o of offenders.slice(0, 50)) {
      const where = o.line ? `:${o.line}` : '';
      const extra = o.preview ? ` | ${o.preview}` : '';
      console.error(`- ${o.file}${where}: ${o.reason}${extra}`);
    }
    if (offenders.length > 50) console.error(`...and ${offenders.length - 50} more`);
    console.error(`\nUse canonical path: ${canonicalDir}`);
    process.exit(1);
  }

  console.log(`OK: decision-record path is canonical (${canonicalDir}); no ${deprecatedDir} references found.`);
}

main();
