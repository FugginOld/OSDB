#!/usr/bin/env node

const assert = require('assert');
const { loadWizard } = require('./lib/osdb-wizard-harness.cjs');

const wiz = loadWizard();

// Representative bases: Ubuntu (uses suites + mirrors), Arch (mirror defaults with $repo/$arch), Gentoo (mirror default)
const ubuntuBase = wiz.BASES['ubuntu-2404'];
const archBase = wiz.BASES.arch;
const gentooBase = wiz.BASES.gentoo;

assert(ubuntuBase, 'Expected base ubuntu-2404 to exist');
assert(archBase, 'Expected base arch to exist');
assert(gentooBase, 'Expected base gentoo to exist');

function assertCommonShape(ctx) {
  assert(ctx);
  assert(ctx.base && typeof ctx.base === 'object');
  assert(typeof ctx.name === 'string' && ctx.name.length > 0);
  assert.strictEqual(typeof ctx.dePackages, 'string');
  assert.strictEqual(typeof ctx.userPkgs, 'string');
  assert.strictEqual(typeof ctx.servicePkgs, 'string');
  assert.strictEqual(typeof ctx.services, 'string');
  assert.strictEqual(typeof ctx.mirror, 'string');
  assert.strictEqual(typeof ctx.containerImage, 'string');
}

const name = 'TestDistro';

const ubuntuCtx = wiz.buildBuildContext(ubuntuBase, name);
assertCommonShape(ubuntuCtx);
assert(ubuntuCtx.containerImage.startsWith('ubuntu:'), 'Ubuntu containerImage should be ubuntu:<suite>');
assert(/^https?:\/\//.test(ubuntuCtx.mirror), 'Ubuntu mirror should be an http(s) URL');

const archCtx = wiz.buildBuildContext(archBase, name);
assertCommonShape(archCtx);
assert.strictEqual(archCtx.containerImage, 'archlinux:latest');
assert(archCtx.mirror.includes('$repo/os/$arch'), 'Arch mirror should preserve $repo/$arch placeholders');

const gentooCtx = wiz.buildBuildContext(gentooBase, name);
assertCommonShape(gentooCtx);
assert.strictEqual(gentooCtx.containerImage, 'gentoo/stage3:amd64-openrc');
const gentooMirrorUrl = new URL(gentooCtx.mirror);
assert.strictEqual(gentooMirrorUrl.hostname, 'distfiles.gentoo.org', 'Gentoo mirror should default to distfiles.gentoo.org');

console.log('All build context tests passed.');
