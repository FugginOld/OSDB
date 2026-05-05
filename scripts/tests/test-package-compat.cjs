#!/usr/bin/env node
'use strict';

const assert = require('assert');

const { loadWizard } = require('./lib/osdb-wizard-harness.cjs');
const { resolvePkgName, getEnabledPackages } = require('./lib/pkg-resolution.cjs');

function main() {
  const wizard = loadWizard();
  const bases = wizard.BASES;
  const packages = wizard.PACKAGES;

  const firefox = packages.find((p) => p.id === 'firefox');
  const vscode = packages.find((p) => p.id === 'vscode');
  const wireplumber = { id: 'wireplumber', pkgName: { apt: 'wireplumber' } };

  assert.equal(resolvePkgName(firefox, bases['debian-12'], 'debian-12'), 'firefox-esr');
  assert.equal(resolvePkgName(firefox, bases['ubuntu-2404'], 'ubuntu-2404'), 'firefox');

  assert.equal(resolvePkgName(vscode, bases['debian-12'], 'debian-12'), 'code');
  assert.equal(resolvePkgName(vscode, bases['ubuntu-2404'], 'ubuntu-2404'), '');

  assert.equal(resolvePkgName(wireplumber, bases['debian-11'], 'debian-11'), 'pipewire-media-session');
  assert.equal(resolvePkgName(wireplumber, bases['debian-12'], 'debian-12'), 'wireplumber');

  // Preset normalization uses the same data.
  const pkgs = getEnabledPackages(bases['debian-12'], { firefox: false }, ['firefox'], packages, 'debian-12');
  assert.ok(pkgs.includes('firefox-esr'));
  assert.ok(!pkgs.includes('firefox'));

  console.log('OK');
}

main();
