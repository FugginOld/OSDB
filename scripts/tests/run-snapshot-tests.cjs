#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { loadWizard } = require('./lib/osdb-wizard-harness.cjs');

const snapshotDir = path.resolve(__dirname, 'snapshots');

const REQUIRED_HEADER_MARKERS = ['cleanup_build_dir()', 'finish_build()', 'start_logging()'];

function normalizeTimestamp(script) {
  return script.replace(/^# Generated At \(UTC\): .+$/m, '# Generated At (UTC): <TIMESTAMP>');
}

const {
  BASES,
  isStableTrack,
  state,
  initDefaultPkgs,
  initDefaultServices,
  generateScript,
} = loadWizard();

function installerFor(base) {
  if (!Array.isArray(base.installers) || base.installers.length === 0) return 'none';
  return base.installers.find((i) => i !== 'none') || base.installers[0];
}

function unifiedDiff(baseId, expected, actual) {
  // Simple line-by-line unified diff
  const expectedLines = expected.split('\n');
  const actualLines = actual.split('\n');
  const lines = [];
  lines.push(`--- scripts/tests/snapshots/${baseId}.sh`);
  lines.push(`+++ (generated)`);

  // Build diff hunks using a basic LCS approach via Myers-style linear scan
  // For simplicity, emit the full file as one hunk if they differ
  let i = 0;
  let j = 0;
  const hunks = [];
  let hunkStart = null;
  const hunkLines = [];

  const maxLen = Math.max(expectedLines.length, actualLines.length);
  for (let k = 0; k < maxLen || i < expectedLines.length || j < actualLines.length; ) {
    const eLine = i < expectedLines.length ? expectedLines[i] : undefined;
    const aLine = j < actualLines.length ? actualLines[j] : undefined;

    if (eLine === aLine) {
      if (hunkLines.length > 0) {
        hunks.push({ start: hunkStart, lines: hunkLines.slice() });
        hunkLines.length = 0;
        hunkStart = null;
      }
      i++;
      j++;
      k = Math.max(i, j);
    } else {
      if (hunkStart === null) hunkStart = i + 1;
      if (eLine !== undefined) {
        hunkLines.push(`-${eLine}`);
        i++;
      }
      if (aLine !== undefined) {
        hunkLines.push(`+${aLine}`);
        j++;
      }
      k = Math.max(i, j);
    }
  }
  if (hunkLines.length > 0) {
    hunks.push({ start: hunkStart, lines: hunkLines.slice() });
  }

  for (const hunk of hunks) {
    const removedCount = hunk.lines.filter((l) => l.startsWith('-')).length;
    const addedCount = hunk.lines.filter((l) => l.startsWith('+')).length;
    lines.push(`@@ -${hunk.start},${removedCount} +${hunk.start},${addedCount} @@`);
    for (const l of hunk.lines) {
      lines.push(l);
    }
  }

  return lines.join('\n');
}

const stableBaseIds = Object.entries(BASES)
  .filter(([, b]) => isStableTrack(b.track) && !b.eol)
  .map(([id]) => id)
  .sort();

let firstFailure = null;
const failures = [];

for (const baseId of stableBaseIds) {
  const snapshotFile = path.join(snapshotDir, `${baseId}.sh`);

  if (!fs.existsSync(snapshotFile)) {
    console.error(`MISSING snapshot: ${snapshotFile}`);
    console.error(`  Run: node scripts/tests/update-snapshots.cjs`);
    failures.push(baseId);
    if (firstFailure === null) {
      firstFailure = { baseId, diff: null };
    }
    continue;
  }

  const base = BASES[baseId];
  const de = Array.isArray(base.des) && base.des.length ? base.des[0] : 'none';

  state.base = baseId;
  state.de = de;
  state.distroName = `osdb-${baseId}`;
  state.repoType = 'official';
  state.customMirrorUrl = '';
  state.ppaList = '';
  state.installer = installerFor(base);
  state.rpiHardware =
    base.family === 'rpi' || base.family === 'rpi-ubuntu' || base.family === 'rpi-arch'
      ? 'rpi4'
      : null;
  initDefaultPkgs();
  initDefaultServices();

  const fresh = normalizeTimestamp(generateScript());

  for (const marker of REQUIRED_HEADER_MARKERS) {
    if (!fresh.includes(marker)) {
      failures.push(`${baseId}:${marker}`);
      if (firstFailure === null) {
        firstFailure = { baseId, diff: `Missing required script header marker: ${marker}` };
      }
    }
  }

  const stored = fs.readFileSync(snapshotFile, 'utf8');

  if (fresh !== stored) {
    failures.push(baseId);
    if (firstFailure === null) {
      firstFailure = { baseId, diff: unifiedDiff(baseId, stored, fresh) };
    }
  }
}

if (failures.length > 0) {
  console.error(`\nSnapshot test FAILED for: ${failures.join(', ')}`);
  if (firstFailure.diff !== null) {
    console.error(`\nFirst failure diff (${firstFailure.baseId}):\n`);
    console.error(firstFailure.diff);
  } else {
    console.error(`\nFirst failure (${firstFailure.baseId}): missing snapshot file`);
  }
  console.error(`\nTo update snapshots intentionally, run:`);
  console.error(`  node scripts/tests/update-snapshots.cjs`);
  process.exit(1);
}

console.log(`All ${stableBaseIds.length} snapshot tests passed.`);
