#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const envRoot = path.join(repoRoot, 'docs', 'environments');

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(full));
    else if (ent.isFile() && ent.name === 'environment.md') out.push(full);
  }
  return out;
}

const files = walk(envRoot);
let updated = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const re = /## Core Package Set\s*```text\s*([\s\S]*?)\s*```/m;
  const m = raw.match(re);
  if (!m) continue;
  const pkgs = m[1]
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);
  const sorted = [...new Set(pkgs)].sort((a, b) => a.localeCompare(b));
  const replacement = `## Core Package Set\n\n\`\`\`text\n${sorted.join('\n')}\n\`\`\``;
  const next = raw.replace(re, replacement);
  if (next !== raw) {
    fs.writeFileSync(file, next, 'utf8');
    updated++;
    process.stdout.write(`${path.relative(repoRoot, file).replace(/\\/g, '/')}\n`);
  }
}

process.stdout.write(`UPDATED=${updated}\n`);
