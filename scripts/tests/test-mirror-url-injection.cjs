#!/usr/bin/env node
/**
 * Test for mirror URL injection prevention.
 * Verifies that malicious URLs with quotes, newlines, and heredoc terminators
 * are rejected and fallback to default mirrors.
 */

const fs = require('fs');
const path = require('path');
const { loadWizard } = require('./lib/osdb-wizard-harness.cjs');

const { BASES, state, initDefaultPkgs, initDefaultServices, generateScript } = loadWizard();

const FAILS = [];

/**
 * Test helper: Generate a script with a custom mirror URL and check expectations.
 */
function testMirrorInjection(testName, baseId, customMirrorUrl, expectations) {
  const base = BASES[baseId];
  if (!base) {
    FAILS.push(`${testName}: base ${baseId} not found`);
    return;
  }

  state.base = baseId;
  state.de = base.des && base.des.length > 0 ? base.des[0] : 'none';
  state.distroName = `test-${testName}`;
  state.repoType = 'custom';
  state.customMirrorUrl = customMirrorUrl;
  state.ppaList = '';
  state.installer = base.installers && base.installers.length > 0 ? base.installers[0] : 'none';
  state.rpiHardware = (base.family === 'rpi' || base.family === 'rpi-ubuntu' || base.family === 'rpi-arch') ? 'rpi4' : null;

  initDefaultPkgs();
  initDefaultServices();

  const script = generateScript();

  // Check expectations
  for (const expectation of expectations) {
    if (expectation.shouldContain) {
      if (!script.includes(expectation.shouldContain)) {
        FAILS.push(`${testName}: expected script to contain "${expectation.shouldContain}"`);
      }
    }
    if (expectation.shouldNotContain) {
      if (script.includes(expectation.shouldNotContain)) {
        FAILS.push(`${testName}: expected script NOT to contain "${expectation.shouldNotContain}"`);
      }
    }
  }
}

/**
 * Test helper: Generate a script with PPA list and check expectations.
 */
function testPpaInjection(testName, baseId, ppaList, expectations) {
  const base = BASES[baseId];
  if (!base) {
    FAILS.push(`${testName}: base ${baseId} not found`);
    return;
  }

  state.base = baseId;
  state.de = base.des && base.des.length > 0 ? base.des[0] : 'none';
  state.distroName = `test-${testName}`;
  state.repoType = 'ppa';
  state.customMirrorUrl = '';
  state.ppaList = ppaList;
  state.installer = base.installers && base.installers.length > 0 ? base.installers[0] : 'none';

  initDefaultPkgs();
  initDefaultServices();

  const script = generateScript();

  // Check expectations
  for (const expectation of expectations) {
    if (expectation.shouldContain) {
      if (!script.includes(expectation.shouldContain)) {
        FAILS.push(`${testName}: expected script to contain "${expectation.shouldContain}"`);
      }
    }
    if (expectation.shouldNotContain) {
      if (script.includes(expectation.shouldNotContain)) {
        FAILS.push(`${testName}: expected script NOT to contain "${expectation.shouldNotContain}"`);
      }
    }
  }
}

// Test 1: Debian/Ubuntu (live-build) - URL with double quotes
testMirrorInjection(
  'livebuild-double-quote',
  'debian-12',
  'http://evil.com" --parent-archive-areas "main universe',
  [
    { shouldContain: BASES['debian-12'].mirror || 'http://deb.debian.org/debian' },
    { shouldNotContain: 'evil.com' }
  ]
);

// Test 2: Arch (archiso) - URL with newline and MIRROR_EOF
testMirrorInjection(
  'archiso-heredoc-escape',
  'arch',
  'http://evil.com\nMIRROR_EOF\nrm -rf /\ncat << MIRROR_EOF',
  [
    { shouldContain: BASES['arch'].mirror },
    { shouldNotContain: 'evil.com' },
    { shouldNotContain: 'rm -rf /' }  // More specific: we don't want "rm -rf /" (root)
  ]
);

// Test 3: Ubuntu RPi (ubuntu-rpi) - URL with shell metacharacters
testMirrorInjection(
  'ubuntu-rpi-shell-injection',
  'ubuntu-rpi-2404',
  'http://evil.com"; rm -rf /tmp; echo "',
  [
    { shouldContain: BASES['ubuntu-rpi-2404'].mirror },
    { shouldNotContain: 'evil.com' }
  ]
);

// Test 4: Valid custom mirror should be used
testMirrorInjection(
  'valid-custom-mirror',
  'debian-12',
  'https://mirror.example.com/debian',
  [
    { shouldContain: 'mirror.example.com/debian' }
  ]
);

// Test 5: Gentoo (catalyst) - URL with single quotes
testMirrorInjection(
  'catalyst-single-quote',
  'gentoo',
  "http://evil.com' && rm -rf / && echo '",
  [
    { shouldContain: BASES['gentoo'].mirror || 'https://distfiles.gentoo.org' },
    { shouldNotContain: 'evil.com' }
  ]
);

// Test 6: Empty URL should fall back to default
testMirrorInjection(
  'empty-mirror-url',
  'debian-12',
  '',
  [
    { shouldContain: BASES['debian-12'].mirror }
  ]
);

// Test 7: URL with special chars that are NOT allowed (pipe, ampersand, backticks)
testMirrorInjection(
  'special-chars-rejected',
  'debian-12',
  'http://evil.com/|whoami',
  [
    { shouldContain: BASES['debian-12'].mirror },
    { shouldNotContain: 'evil.com' }
  ]
);

// ─── PPA Injection Tests ──────────────────────────────────────────────────────

// Test 8: PPA with double quotes - should be skipped
testPpaInjection(
  'ppa-double-quote',
  'ubuntu-2204',
  'ppa:user/name" && rm -rf / && echo "',
  [
    { shouldContain: '# skipped invalid PPA:' },
    { shouldNotContain: 'add-apt-repository -y "ppa:user/name" && rm -rf / && echo ""' }
  ]
);

// Test 9: PPA with $() command substitution - should be skipped
testPpaInjection(
  'ppa-command-substitution',
  'ubuntu-2204',
  'ppa:user/$(whoami)',
  [
    { shouldContain: '# skipped invalid PPA:' },
    { shouldNotContain: 'add-apt-repository -y "ppa:user/$(whoami)"' }
  ]
);

// Test 10: PPA with newlines - each line processed separately
testPpaInjection(
  'ppa-newlines',
  'ubuntu-2204',
  'ppa:user/name\nrm -rf /tmp\necho evil',
  [
    { shouldContain: 'add-apt-repository -y "ppa:user/name"' },
    { shouldContain: '# skipped invalid PPA: rm -rf /tmp' },
    { shouldContain: '# skipped invalid PPA: echo evil' },
    { shouldNotContain: 'add-apt-repository -y "rm -rf /tmp"' },
    { shouldNotContain: 'add-apt-repository -y "echo evil"' }
  ]
);

// Test 11: Valid PPA - should be included correctly
testPpaInjection(
  'ppa-valid',
  'ubuntu-2204',
  'ppa:deadsnakes/python3.8',
  [
    { shouldContain: 'add-apt-repository -y "ppa:deadsnakes/python3.8"' },
    { shouldNotContain: '# skipped invalid PPA:' }
  ]
);

// Test 12: Mixed valid and invalid PPAs
testPpaInjection(
  'ppa-mixed',
  'ubuntu-2204',
  'ppa:deadsnakes/python3.8\nppa:user/name" evil\nppa:git-core/ppa',
  [
    { shouldContain: 'add-apt-repository -y "ppa:deadsnakes/python3.8"' },
    { shouldContain: 'add-apt-repository -y "ppa:git-core/ppa"' },
    { shouldContain: '# skipped invalid PPA: ppa:user/name" evil' },
    { shouldNotContain: 'add-apt-repository -y "ppa:user/name" evil"' }
  ]
);

// Test 13: PPA with special characters in username/name (dots, underscores, hyphens) - should be valid
testPpaInjection(
  'ppa-special-chars-valid',
  'ubuntu-2204',
  'ppa:user.name_test-123/ppa-name_1.0',
  [
    { shouldContain: 'add-apt-repository -y "ppa:user.name_test-123/ppa-name_1.0"' },
    { shouldNotContain: '# skipped invalid PPA:' }
  ]
);

// Report results
if (FAILS.length > 0) {
  console.log('FAILED:');
  FAILS.forEach(f => console.log(`  ${f}`));
  process.exit(1);
} else {
  console.log('All mirror URL injection tests passed!');
  process.exit(0);
}
