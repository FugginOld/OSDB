#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { loadWizard } = require('./lib/osdb-wizard-harness.cjs');

const repoRoot = path.resolve(__dirname, '..', '..');
const envRoot = path.join(repoRoot, 'docs', 'environments');

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
  const markers = ['## Core Package Set', '## Core System Packages'];
  let idx = -1;
  for (const marker of markers) {
    const mIdx = md.indexOf(marker);
    if (mIdx !== -1 && (idx === -1 || mIdx < idx)) idx = mIdx;
  }
  if (idx === -1) return [];
  const tail = md.slice(idx);
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
  }  return null;
}

function validatePackages(baseId, base, pkgs, compatMap) {
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

  for (const p of pkgs) {
    const compat = compatMap && compatMap[p];
    if (compat && Array.isArray(compat.incompatibleBases) && compat.incompatibleBases.includes(baseId)) {
      issues.push({ code: 'incompatible-package', pkg: p, msg: `Package token '${p}' is incompatible with base '${baseId}'` });
      continue;
    }
    if (compat && compat.overrides && compat.overrides[baseId] && compat.overrides[baseId] !== p) {
      issues.push({
        code: 'package-name-override',
        pkg: p,
        msg: `Package token '${p}' should be '${compat.overrides[baseId]}' for base '${baseId}'`,
      });
    }
  }

  return issues;
}

function main() {
  const { BASES, PACKAGE_COMPAT } = loadWizard();
  const envFiles = findEnvironmentFiles(envRoot);

  const findings = [];
  for (const file of envFiles) {
    const baseId = detectBaseIdFromPath(file, BASES);
    if (!baseId || !BASES[baseId]) continue;
    const base = BASES[baseId];
    const md = fs.readFileSync(file, 'utf8');
    const pkgs = extractCorePackages(md);
    if (!pkgs.length) {
      findings.push({
        file: path.relative(repoRoot, file).replace(/\\/g, '/'),
        baseId,
        issues: [{ code: 'missing-core-package-set', msg: 'No packages found in a supported core package block (Core Package Set/Core System Packages)' }],
      });
      continue;
    }
    const issues = validatePackages(baseId, base, pkgs, PACKAGE_COMPAT);
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
    console.log('OK: no package-name consistency issues found across environment.md core package blocks.');
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
