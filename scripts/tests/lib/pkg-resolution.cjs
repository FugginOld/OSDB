'use strict';

/**
 * Builds default package state for a given base.
 * Mirrors initDefaultPkgs() in wizard.js.
 *
 * @param {object}   base     - A BASES entry (with .family field)
 * @param {object[]} packages - PACKAGES array from wizard data
 * @returns {object} Map of packageId -> boolean (default enabled state)
 */
function buildDefaultPkgs(base, packages) {
  return Object.fromEntries(
    packages.filter((p) => p.families.includes(base.family)).map((p) => [p.id, p.defaultOn]),
  );
}

/**
 * Builds default service state for a given base.
 * Mirrors initDefaultServices() in wizard.js.
 *
 * @param {object}   base         - A BASES entry (with .family field)
 * @param {object[]} servicesData - SERVICES array from wizard data
 * @returns {object} Map of serviceId -> boolean (default enabled state)
 */
function buildDefaultServices(base, servicesData) {
  return Object.fromEntries(
    servicesData
      .filter((s) => s.families === null || s.families.includes(base.family))
      .map((s) => [s.id, s.defaultOn]),
  );
}

/**
 * Resolves the package name for a given PACKAGES entry and base.
 * Handles per-distro exceptions (firefox-esr/firefox split, vscode Ubuntu exclusion).
 *
 * @param {object} pkg  - A PACKAGES entry (with .id, .pkgName fields)
 * @param {object} base - A BASES entry (with .pkg, .family fields)
 * @returns {string} Resolved package name, or '' to skip this package
 */
function resolvePkgName(pkg, base) {
  // firefox-esr is Debian-specific; Ubuntu uses firefox.
  if (pkg.id === 'firefox' && base.pkg === 'apt') {
    return base.family === 'debian' ? 'firefox-esr' : 'firefox';
  }

  // VS Code ("code") is not in Ubuntu's default apt repos.
  if (pkg.id === 'vscode' && base.pkg === 'apt' && base.family === 'ubuntu') {
    return '';
  }

  return pkg.pkgName && pkg.pkgName[base.pkg] ? pkg.pkgName[base.pkg] : pkg.id;
}

/**
 * Returns resolved package name tokens for the enabled packages.
 * Equivalent to what enabledPkgList() produces in wizard.js.
 *
 * @param {object}   base          - A BASES entry (with .pkg, .family, .suite fields)
 * @param {object}   pkgs          - Map of packageId -> boolean (enabled state)
 * @param {string[]} presetCorePkgs - Array of preset package name strings
 * @param {object[]} packages      - PACKAGES array from wizard data
 * @returns {string[]} Flat array of resolved, deduplicated package name tokens
 */
function getEnabledPackages(base, pkgs, presetCorePkgs, packages) {
  const selectedTogglePkgs = packages
    .filter((p) => p.families.includes(base.family) && pkgs[p.id])
    .map((p) => resolvePkgName(p, base))
    .filter(Boolean)
    .flatMap((name) => String(name).split(/\s+/).filter(Boolean));

  const normalizePresetPkgName = (name) => {
    const n = String(name || '').trim();
    if (!n) return '';
    // Debian uses firefox-esr in official repos for current supported releases.
    if (base.pkg === 'apt' && base.family === 'debian' && n === 'firefox') {
      return 'firefox-esr';
    }
    // Older apt-based releases may not provide wireplumber consistently.
    // Skip it there to avoid hard install failures from unavailable audio session packages.
    if (base.pkg === 'apt' && n === 'wireplumber') {
      const oldDebian = base.family === 'debian' && ['stretch', 'buster', 'bullseye'].includes(base.suite || '');
      const oldUbuntu = (base.family === 'ubuntu' || base.family === 'rpi-ubuntu') && ['focal'].includes(base.suite || '');
      if (oldDebian || oldUbuntu) {
        return '';
      }
    }
    return n;
  };

  const presetPkgs = Array.isArray(presetCorePkgs)
    ? presetCorePkgs
        .map(normalizePresetPkgName)
        .filter(Boolean)
        .flatMap((name) => String(name).split(/\s+/).filter(Boolean))
    : [];

  return [...new Set([...selectedTogglePkgs, ...presetPkgs])].filter(Boolean);
}

/**
 * Returns resolved service package name tokens for the enabled services.
 * Handles the rpios-lite-bookworm SSH special case (SSH enabled by default on RPi Lite).
 * Equivalent to what enabledServicePkgList() produces in wizard.js.
 *
 * @param {object}   base         - A BASES entry (with .pkg, .family fields)
 * @param {object}   services     - Map of serviceId -> boolean (enabled state)
 * @param {object[]} servicesData - SERVICES array from wizard data
 * @param {string}   [baseId]     - Base ID (for rpios-lite-bookworm SSH special case)
 * @returns {string[]} Flat array of resolved service package name tokens
 */
function getEnabledServicePackages(base, services, servicesData, baseId) {
  const pkgSet = new Set(
    servicesData
      .filter((s) => services[s.id])
      .filter((s) => s.families === null || s.families.includes(base.family))
      .map((s) => (s.pkgName && s.pkgName[base.pkg] ? s.pkgName[base.pkg] : ''))
      .filter(Boolean)
      .flatMap((name) => String(name).split(/\s+/).filter(Boolean)),
  );

  // Special: RPi Lite defaults SSH on (mirrors initDefaultServices() in wizard.js)
  if (baseId === 'rpios-lite-bookworm') {
    const sshSvc = servicesData.find((s) => s.id === 'sshd');
    if (sshSvc && sshSvc.pkgName && sshSvc.pkgName[base.pkg]) {
      for (const pkg of String(sshSvc.pkgName[base.pkg]).split(/\s+/).filter(Boolean)) {
        pkgSet.add(pkg);
      }
    }
  }

  return [...pkgSet];
}

/**
 * Returns enabled service unit names for the enabled services.
 * Handles the rpios-lite-bookworm SSH special case.
 *
 * @param {object}   base         - A BASES entry (with .family fields)
 * @param {object}   services     - Map of serviceId -> boolean (enabled state)
 * @param {object[]} servicesData - SERVICES array from wizard data
 * @param {string}   [baseId]     - Base ID (for rpios-lite-bookworm SSH special case)
 * @returns {string[]} Array of service unit name strings
 */
function getEnabledServiceUnits(base, services, servicesData, baseId) {
  const units = servicesData
    .filter((s) => services[s.id])
    .filter((s) => s.families === null || s.families.includes(base.family))
    .map((s) => s.unit)
    .filter(Boolean);

  // Special: RPi Lite defaults SSH on (mirrors initDefaultServices() in wizard.js)
  if (baseId === 'rpios-lite-bookworm') {
    const sshSvc = servicesData.find((s) => s.id === 'sshd');
    if (sshSvc && sshSvc.unit && !units.includes(sshSvc.unit)) {
      units.push(sshSvc.unit);
    }
  }

  return units;
}

module.exports = {
  buildDefaultPkgs,
  buildDefaultServices,
  resolvePkgName,
  getEnabledPackages,
  getEnabledServicePackages,
  getEnabledServiceUnits,
};
