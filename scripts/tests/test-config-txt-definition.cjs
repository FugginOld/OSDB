#!/usr/bin/env node
'use strict';

/**
 * Test: Verify all generators that use CONFIG_TXT variable define it first
 *
 * This test prevents the recurrence of undefined variable errors in generated
 * scripts that run with 'set -u'. Any generator that references ${CONFIG_TXT}
 * must define it before use.
 */

const fs = require('fs');
const path = require('path');
const { loadWizard } = require('./lib/osdb-wizard-harness.cjs');

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

let failures = 0;

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

  const script = generateScript();

  // Check if script uses CONFIG_TXT variable
  const usesConfigTxt = /\$\{CONFIG_TXT\}/.test(script);

  if (usesConfigTxt) {
    // Find where CONFIG_TXT is referenced
    const configTxtUsageMatch = script.match(/\$\{CONFIG_TXT\}/);
    if (!configTxtUsageMatch) continue;

    const usageIndex = configTxtUsageMatch.index;
    const beforeUsage = script.substring(0, usageIndex);

    // Check if CONFIG_TXT is defined before its first use
    const definesConfigTxt = /^CONFIG_TXT=/m.test(beforeUsage);

    if (!definesConfigTxt) {
      console.error(`FAIL: ${baseId} uses \${CONFIG_TXT} but never defines CONFIG_TXT before use`);
      failures++;
    } else {
      console.log(`PASS: ${baseId} properly defines CONFIG_TXT before use`);
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} base(s) failed CONFIG_TXT definition check`);
  process.exit(1);
}

console.log(`\nAll bases that use CONFIG_TXT define it correctly.`);
