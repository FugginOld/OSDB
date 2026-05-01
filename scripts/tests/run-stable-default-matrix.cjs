#!/usr/bin/env node

const path = require('path');
const { loadWizard } = require('./lib/osdb-wizard-harness.cjs');

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

function expectedDefaultPackages(base) {
  const resolvePkgName = (p) => {
    if (p.id === 'firefox' && base.pkg === 'apt') {
      return base.family === 'debian' ? 'firefox-esr' : 'firefox';
    }
    if (p.id === 'vscode' && base.pkg === 'apt' && base.family === 'ubuntu') {
      return '';
    }
    return p.pkgName && p.pkgName[base.pkg] ? p.pkgName[base.pkg] : '';
  };

  return PACKAGES
    .filter((p) => p.defaultOn && p.families.includes(base.family))
    .map(resolvePkgName)
    .filter(Boolean)
    .flatMap((name) => String(name).split(/\s+/).filter(Boolean));
}

function expectedDefaultServicePackages(base, baseId) {
  const list = SERVICES
    .filter((s) => {
      const familyOk = s.families === null || s.families.includes(base.family);
      return familyOk && s.defaultOn;
    })
    .map((s) => (s.pkgName && s.pkgName[base.pkg] ? s.pkgName[base.pkg] : ''))
    .filter(Boolean)
    .flatMap((name) => String(name).split(/\s+/).filter(Boolean));

  if (baseId === 'rpios-lite-bookworm') {
    const sshSvc = SERVICES.find((s) => s.id === 'sshd');
    if (sshSvc && sshSvc.pkgName && sshSvc.pkgName[base.pkg]) {
      list.push(...String(sshSvc.pkgName[base.pkg]).split(/\s+/).filter(Boolean));
    }
  }

  return list;
}

function expectedDefaultServiceUnits(base, baseId) {
  const units = SERVICES
    .filter((s) => {
      const familyOk = s.families === null || s.families.includes(base.family);
      return familyOk && s.defaultOn;
    })
    .map((s) => s.unit)
    .filter(Boolean);

  if (baseId === 'rpios-lite-bookworm') {
    const sshSvc = SERVICES.find((s) => s.id === 'sshd');
    if (sshSvc && sshSvc.unit) units.push(sshSvc.unit);
  }

  return units;
}

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

  const expectedPkgs = expectedDefaultPackages(base);
  const expectedSvcPkgs = expectedDefaultServicePackages(base, baseId);
  const expectedUnits = expectedDefaultServiceUnits(base, baseId);

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