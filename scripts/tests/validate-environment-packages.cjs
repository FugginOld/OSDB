#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const wizardPath = path.join(repoRoot, 'docs', 'wizard.js');
const envRoot = path.join(repoRoot, 'docs', 'environments');

function readText(p) {
  return fs.readFileSync(p, 'utf8');
}

function extractBasesMap(src) {
  const start = src.indexOf('const BASES = {');
  if (start === -1) throw new Error('Could not locate BASES in docs/wizard.js');
  const end = src.indexOf('\n};', start);
  if (end === -1) throw new Error('Could not locate end of BASES block');
  const block = src.slice(start, end);

  const baseRe = /'([^']+)'\s*:\s*\{([\s\S]*?)\n\s*\},/g;
  const out = {};
  let m;
  while ((m = baseRe.exec(block)) !== null) {
    const baseId = m[1];
    const body = m[2];
    const fam = /family:\s*'([^']+)'/.exec(body);
    const pkg = /pkg:\s*'([^']+)'/.exec(body);
    if (fam && pkg) {
      out[baseId] = { family: fam[1], pkg: pkg[1] };
    }
  }
  return out;
}

function walkDirs(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(full, ...walkDirs(full));
  }
  return out;
}

function findEnvironmentFiles(root) {
  return walkDirs(root)
    .filter(d => /_environment_profiles$/i.test(path.basename(d)) || path.basename(path.dirname(d)).endsWith('_environment_profiles'))
    .flatMap(d => {
      const files = [];
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const md = path.join(d, entry.name, 'environment.md');
        if (fs.existsSync(md)) files.push(md);
      }
      return files;
    })
    // dedupe
    .filter((v, i, a) => a.indexOf(v) === i);
}

function extractCorePackages(md) {
  const marker = '## Core Package Set';
  const idx = md.indexOf(marker);
  if (idx === -1) return [];
  const tail = md.slice(idx + marker.length);
  const fenceOpen = tail.indexOf('```');
  if (fenceOpen === -1) return [];
  const rest = tail.slice(fenceOpen + 3);
  const firstNl = rest.indexOf('\n');
  if (firstNl === -1) return [];
  const afterLang = rest.slice(firstNl + 1);
  const fenceClose = afterLang.indexOf('```');
  const block = fenceClose === -1 ? afterLang : afterLang.slice(0, fenceClose);
  return block
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean)
    .filter(s => !s.startsWith('#'));
}

function detectBaseIdFromPath(p, baseMap) {
  const normalized = p.replace(/\\/g, '/');
  for (const id of Object.keys(baseMap)) {
    if (normalized.includes(`/environments/${id}_environment_profiles/`)) return id;
  }
  if (normalized.includes('/environments/debian_trixie_environment_profiles/')) return 'debian-13';
  return null;
}

function validatePackages(base, pkgs) {
  const issues = [];
  const seen = new Set();

  for (const p of pkgs) {
    if (seen.has(p)) {
      issues.push({ code: 'duplicate-package', pkg: p, msg: `Duplicate package token '${p}'` });
    }
    seen.add(p);
  }

  for (const p of pkgs) {
    if (base.pkg === 'emerge' && !p.includes('/')) {
      issues.push({ code: 'gentoo-missing-category', pkg: p, msg: `Gentoo package '${p}' should use category/package` });
    }
    if (base.pkg !== 'emerge' && p.includes('/')) {
      issues.push({ code: 'unexpected-category-slash', pkg: p, msg: `Non-Gentoo package '${p}' should not include category/package` });
    }
  }

  if (base.family === 'debian') {
    for (const p of pkgs) {
      if (p === 'firefox') {
        issues.push({ code: 'debian-firefox-name', pkg: p, msg: "Debian profiles should use 'firefox-esr' instead of 'firefox'" });
      }
    }
  }
  if (base.family === 'ubuntu' || base.family === 'rpi-ubuntu') {
    for (const p of pkgs) {
      if (p === 'firefox-esr') {
        issues.push({ code: 'ubuntu-firefox-name', pkg: p, msg: "Ubuntu profiles should generally use 'firefox' instead of 'firefox-esr'" });
      }
    }
  }

  return issues;
}

function main() {
  const wizard = readText(wizardPath);
  const baseMap = extractBasesMap(wizard);
  const envFiles = findEnvironmentFiles(envRoot);

  const findings = [];
  for (const file of envFiles) {
    const baseId = detectBaseIdFromPath(file, baseMap);
    if (!baseId || !baseMap[baseId]) continue;
    const base = baseMap[baseId];
    const md = readText(file);
    const pkgs = extractCorePackages(md);
    if (!pkgs.length) {
      findings.push({
        file: path.relative(repoRoot, file).replace(/\\/g, '/'),
        baseId,
        issues: [{ code: 'missing-core-package-set', msg: 'No packages found in Core Package Set block' }],
      });
      continue;
    }
    const issues = validatePackages(base, pkgs);
    if (issues.length) {
      findings.push({
        file: path.relative(repoRoot, file).replace(/\\/g, '/'),
        baseId,
        issueCount: issues.length,
        issues,
      });
    }
  }

  if (!findings.length) {
    console.log('OK: no package-name consistency issues found across environment.md Core Package Set blocks.');
    process.exit(0);
  }

  console.log(`Found issues in ${findings.length} file(s):`);
  for (const f of findings) {
    console.log(`- ${f.file} (${f.baseId})`);
    for (const i of f.issues.slice(0, 10)) {
      console.log(`  - [${i.code}] ${i.msg}`);
    }
    if (f.issues.length > 10) {
      console.log(`  - ... ${f.issues.length - 10} more issue(s)`);
    }
  }
  process.exit(1);
}

main();

