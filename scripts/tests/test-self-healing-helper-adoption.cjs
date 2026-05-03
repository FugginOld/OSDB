#!/usr/bin/env node

const assert = require('assert').strict;
const { loadWizard } = require('./lib/osdb-wizard-harness.cjs');

function countOccurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

const wiz = loadWizard();

const debianBase = wiz.BASES['debian-12'];
const archBase = wiz.BASES['arch'];
assert.ok(debianBase, 'debian-12 base should exist');
assert.ok(archBase, 'arch base should exist');

// Ensure required state for generators.
wiz.state.de = 'none';
wiz.state.installer = 'none';
wiz.state.repoType = 'none';
wiz.state.services = {};
wiz.state.pkgs = {};
wiz.state.distroName = 'TestDistro';

wiz.state.base = 'debian-12';
const debianScript = wiz.generateScript(debianBase, 'TestDistro');

wiz.state.base = 'arch';
const archScript = wiz.generateScript(archBase, 'TestDistro');

assert.ok(debianScript.includes('# ── Self-Healing Mirror Configuration'), 'live-build should include helper self-healing header');
assert.ok(archScript.includes('# ── Self-Healing Mirror Configuration'), 'archiso should include helper self-healing header');

assert.equal(countOccurrences(debianScript, 'MAX_RETRIES_PER_MIRROR=2'), 1, 'live-build should define MAX_RETRIES_PER_MIRROR once');
assert.equal(countOccurrences(archScript, 'MAX_RETRIES_PER_MIRROR=2'), 1, 'archiso should define MAX_RETRIES_PER_MIRROR once');

assert.equal(countOccurrences(debianScript, 'Primary mirror exhausted after'), 1, 'live-build should emit exhaustion marker once');
assert.equal(countOccurrences(archScript, 'Primary mirror exhausted after'), 1, 'archiso should emit exhaustion marker once');

console.log('Self-healing helper adoption test passed.');
