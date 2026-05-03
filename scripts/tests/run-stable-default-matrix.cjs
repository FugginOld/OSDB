#!/usr/bin/env node

const path = require('path');
const { loadWizard } = require('./lib/osdb-wizard-harness.cjs');
const { buildDefaultPkgs, buildDefaultServices, getEnabledPackages, getEnabledServicePackages, getEnabledServiceUnits } = require('./lib/pkg-resolution.cjs');

const {
  BASES,
  PACKAGES,
  SERVICES,
  STABLE_TRACKS,
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
  .filter(([, b]) => STABLE_TRACKS.has(b.track) && !b.eol)
  .map(([id]) => id)
  .sort();

const failures = [];

for (const baseId of stableBaseIds) {
  const base = BASES[baseId];
  const des = Array.isArray(base.des) && base.des.length ? base.des : ['none'];

  const defaultPkgs = buildDefaultPkgs(base, PACKAGES);
  const defaultServices = buildDefaultServices(base, SERVICES);
  const expectedPkgs = getEnabledPackages(base, defaultPkgs, [], PACKAGES);
  const expectedSvcPkgs = getEnabledServicePackages(base, defaultServices, SERVICES, baseId);
  const expectedUnits = getEnabledServiceUnits(base, defaultServices, SERVICES, baseId);

  for (const de of des) {
    try {
      state.base = baseId;
      state.de = de;
      state.distroName = `test-${baseId}-${de}`;
      state.repoType = 'official';
      state.customMirrorUrl = '';
      state.ppaList = '';
      state.installer = installerFor(base);
      state.rpiHardware = (base.family === 'rpi' || base.family === 'rpi-ubuntu' || base.family === 'rpi-arch') ? 'rpi4' : null;
      initDefaultPkgs();
      initDefaultServices();

      const script = generateScript();

      for (const pkg of expectedPkgs) {
        if (!script.includes(pkg)) failures.push(`${baseId}/${de}:missing_default_pkg:${pkg}`);
      }
      for (const pkg of expectedSvcPkgs) {
        if (!script.includes(pkg)) failures.push(`${baseId}/${de}:missing_default_service_pkg:${pkg}`);
      }
      for (const unit of expectedUnits) {
        if (!script.includes(unit)) failures.push(`${baseId}/${de}:missing_default_service_unit:${unit}`);
      }
    } catch (err) {
      failures.push(`${baseId}/${de}:generate_error`);
    }
  }
}

if (failures.length > 0) {
  for (const f of failures) console.log(f);
  process.exit(1);
}