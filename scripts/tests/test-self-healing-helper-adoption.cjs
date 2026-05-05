#!/usr/bin/env node

const assert = require('assert').strict;
const { loadWizard } = require('./lib/osdb-wizard-harness.cjs');

function countOccurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

const wiz = loadWizard();

const debianBase = wiz.BASES['debian-12'];
const archBase = wiz.BASES['arch'];
const loraxBase = wiz.BASES['fedora-41'] || wiz.BASES['fedora-40'];
const kiwiBase = wiz.BASES['opensuse-tumbleweed'] || wiz.BASES['opensuse-leap-156'];
const catalystBase = wiz.BASES['gentoo'];
const alarmBase = wiz.BASES['alarm-rpi4'] || wiz.BASES['alarm-rpi5'];
assert.ok(debianBase, 'debian-12 base should exist');
assert.ok(archBase, 'arch base should exist');
assert.ok(loraxBase, 'a fedora base should exist (fedora-41 or fedora-40)');
assert.ok(kiwiBase, 'an openSUSE base should exist (tumbleweed or leap)');
assert.ok(catalystBase, 'gentoo base should exist');
assert.ok(alarmBase, 'an alarm-rpi base should exist (alarm-rpi4 or alarm-rpi5)');

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

wiz.state.base = 'fedora-41';
const loraxScript = wiz.generateScript(loraxBase, 'TestDistro');

wiz.state.base = 'opensuse-tumbleweed';
const kiwiScript = wiz.generateScript(kiwiBase, 'TestDistro');

wiz.state.base = 'gentoo';
const catalystScript = wiz.generateScript(catalystBase, 'TestDistro');

wiz.state.base = 'alarm-rpi4';
const alarmScript = wiz.generateScript(alarmBase, 'TestDistro');

assert.ok(debianScript.includes('# ── Self-Healing Mirror Configuration'), 'live-build should include helper self-healing header');
assert.ok(archScript.includes('# ── Self-Healing Mirror Configuration'), 'archiso should include helper self-healing header');
assert.ok(loraxScript.includes('# ── Self-Healing Mirror Configuration'), 'lorax should include helper self-healing header');
assert.ok(kiwiScript.includes('# ── Self-Healing Mirror Configuration'), 'kiwi should include helper self-healing header');
assert.ok(catalystScript.includes('# ── Self-Healing Mirror Configuration'), 'catalyst should include helper self-healing header');
assert.ok(alarmScript.includes('# ── Self-Healing Mirror Configuration'), 'alarm-rpi should include helper self-healing header');

assert.equal(countOccurrences(debianScript, 'MAX_RETRIES_PER_MIRROR=2'), 1, 'live-build should define MAX_RETRIES_PER_MIRROR once');
assert.equal(countOccurrences(archScript, 'MAX_RETRIES_PER_MIRROR=2'), 1, 'archiso should define MAX_RETRIES_PER_MIRROR once');
assert.equal(countOccurrences(loraxScript, 'MAX_RETRIES_PER_MIRROR=2'), 1, 'lorax should define MAX_RETRIES_PER_MIRROR once');
assert.equal(countOccurrences(kiwiScript, 'MAX_RETRIES_PER_MIRROR=2'), 1, 'kiwi should define MAX_RETRIES_PER_MIRROR once');
assert.equal(countOccurrences(catalystScript, 'MAX_RETRIES_PER_MIRROR=2'), 1, 'catalyst should define MAX_RETRIES_PER_MIRROR once');
assert.equal(countOccurrences(alarmScript, 'MAX_RETRIES_PER_MIRROR=2'), 1, 'alarm-rpi should define MAX_RETRIES_PER_MIRROR once');

assert.equal(countOccurrences(debianScript, 'Primary mirror exhausted after'), 1, 'live-build should emit exhaustion marker once');
assert.equal(countOccurrences(archScript, 'Primary mirror exhausted after'), 1, 'archiso should emit exhaustion marker once');
assert.equal(countOccurrences(loraxScript, 'Primary mirror exhausted after'), 1, 'lorax should emit exhaustion marker once');
assert.equal(countOccurrences(kiwiScript, 'Primary mirror exhausted after'), 1, 'kiwi should emit exhaustion marker once');
assert.equal(countOccurrences(catalystScript, 'Primary mirror exhausted after'), 1, 'catalyst should emit exhaustion marker once');
assert.equal(countOccurrences(alarmScript, 'Primary mirror exhausted after'), 1, 'alarm-rpi should emit exhaustion marker once');

console.log('Self-healing helper adoption test passed.');
