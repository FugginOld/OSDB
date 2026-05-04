#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { loadWizard } = require('./lib/osdb-wizard-harness.cjs');

const snapshotDir = path.resolve(__dirname, 'snapshots');
fs.mkdirSync(snapshotDir, { recursive: true });

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

const stableBaseIds = Object.entries(BASES)
  .filter(([, b]) => isStableTrack(b.track) && !b.eol)
  .map(([id]) => id)
  .sort();

const written = [];

for (const baseId of stableBaseIds) {
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

  const script = normalizeTimestamp(generateScript());
  const outFile = path.join(snapshotDir, `${baseId}.sh`);
  fs.writeFileSync(outFile, script, 'utf8');
  fs.chmodSync(outFile, 0o755);
  written.push(path.relative(path.resolve(__dirname, '..'), outFile).replace(/\\/g, '/'));
}

console.log(`Wrote ${written.length} snapshots to scripts/tests/snapshots/`);
for (const w of written) {
  console.log(w);
}
