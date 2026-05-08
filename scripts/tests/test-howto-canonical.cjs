#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..', '..');
const canonicalHowto = 'HOWTO.md';
const deprecatedHowto = 'how-to.md';
const selfRel = path.relative(repoRoot, __filename).split(path.sep).join('/');

function listTrackedFiles() {
  const out = execFileSync('git', ['-C', repoRoot, 'ls-files'], { encoding: 'utf8' });
  return out
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function isBinaryBuffer(buf) {
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
  const canonicalPath = path.join(repoRoot, canonicalHowto);
  const deprecatedPath = path.join(repoRoot, deprecatedHowto);

  if (!fs.existsSync(canonicalPath)) {
    console.error(`FAIL: missing canonical HOWTO: ${canonicalHowto}`);
    process.exit(1);
  }
  if (!fs.existsSync(deprecatedPath)) {
    console.error(`FAIL: missing deprecated redirect stub: ${deprecatedHowto}`);
    process.exit(1);
  }

  const deprecatedText = fs.readFileSync(deprecatedPath, 'utf8');
  if (!deprecatedText.includes('./HOWTO.md')) {
    console.error(`FAIL: ${deprecatedHowto} should link to ./HOWTO.md`);
    process.exit(1);
  }

  const requiredRefFile = 'docs/architecture.md';
  const requiredRefNeedle = '../HOWTO.md';
  const requiredRefPath = path.join(repoRoot, requiredRefFile);
  if (!fs.existsSync(requiredRefPath)) {
    console.error(`FAIL: missing required reference file: ${requiredRefFile}`);
    process.exit(1);
  }
  const requiredRefText = fs.readFileSync(requiredRefPath, 'utf8');
  if (!requiredRefText.includes(requiredRefNeedle)) {
    console.error(`FAIL: ${requiredRefFile} should reference ${requiredRefNeedle}`);
    process.exit(1);
  }

  const tracked = listTrackedFiles();
  const offenders = [];

  for (const rel of tracked) {
    if (rel === selfRel) continue;
    if (rel === deprecatedHowto) continue;
    if (shouldSkipFile(rel)) continue;

    const abs = path.join(repoRoot, rel);
    let buf;
    try {
      buf = fs.readFileSync(abs);
    } catch {
      continue;
    }
    if (isBinaryBuffer(buf)) continue;

    const text = buf.toString('utf8');
    if (!text.includes(deprecatedHowto)) continue;
    const loc = findFirstMatchLine(text, deprecatedHowto);
    offenders.push({
      file: rel,
      line: loc ? loc.line : null,
      preview: loc ? loc.preview : null,
    });
  }

  if (offenders.length > 0) {
    console.error(`FAIL: found deprecated HOWTO reference: ${deprecatedHowto}`);
    for (const o of offenders.slice(0, 50)) {
      const where = o.line ? `:${o.line}` : '';
      const extra = o.preview ? ` | ${o.preview}` : '';
      console.error(`- ${o.file}${where}${extra}`);
    }
    if (offenders.length > 50) console.error(`...and ${offenders.length - 50} more`);
    console.error(`\nUse canonical path: ${canonicalHowto}`);
    process.exit(1);
  }

  console.log(`OK: HOWTO is canonical (${canonicalHowto}); no ${deprecatedHowto} references found.`);
}

main();

