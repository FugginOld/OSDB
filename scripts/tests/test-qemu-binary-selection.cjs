#!/usr/bin/env node
/**
 * Test to verify that the ubuntu-rpi generator selects the correct QEMU binary
 * based on the hardware architecture (aarch64 vs armhf).
 *
 * This test ensures that:
 * - aarch64 hardware (rpi5, rpi4, rpi3, rpi2, rpi0-2) uses qemu-aarch64-static
 * - armhf hardware (rpi0) uses qemu-arm-static
 * - Both the copy step and cleanup step use the correct binary
 */

const path = require('path');

// Load wizard
const { loadWizard } = require(path.resolve(__dirname, 'lib/osdb-wizard-harness.cjs'));
const { BASES, RPI_HARDWARE, state, initDefaultPkgs, initDefaultServices, generateScript } = loadWizard();

const ubuntu2404 = BASES['ubuntu-rpi-2404'];
if (!ubuntu2404) {
  console.error('ERROR: ubuntu-rpi-2404 base not found');
  process.exit(1);
}

const failures = [];

// Test each hardware configuration
for (const hwObj of RPI_HARDWARE) {
  const hwId = hwObj.id;
  const expectedArch = hwObj.arch;
  const expectedQemu = expectedArch === 'aarch64' ? 'qemu-aarch64-static' : 'qemu-arm-static';

  // Generate script
  state.base = 'ubuntu-rpi-2404';
  state.de = 'none';
  state.distroName = `test-${hwId}`;
  state.repoType = 'official';
  state.customMirrorUrl = '';
  state.ppaList = '';
  state.installer = 'raspberry-pi-imager';
  state.rpiHardware = hwId;
  initDefaultPkgs();
  initDefaultServices();

  const script = generateScript();

  // Check copy step: cp /usr/bin/qemu-XXX-static
  const copyRegex = new RegExp(`cp /usr/bin/${expectedQemu}`);
  if (!copyRegex.test(script)) {
    failures.push(`${hwId}: Missing correct QEMU copy: expected "cp /usr/bin/${expectedQemu}"`);
  }

  // Check cleanup step: rm -f "${ROOTFS}/usr/bin/qemu-XXX-static"
  const cleanupRegex = new RegExp(`rm -f.*${expectedQemu}`);
  if (!cleanupRegex.test(script)) {
    failures.push(`${hwId}: Missing correct QEMU cleanup: expected "rm -f" with ${expectedQemu}`);
  }

  // Check that the wrong QEMU binary is NOT present
  const wrongQemu = expectedArch === 'aarch64' ? 'qemu-arm-static' : 'qemu-aarch64-static';
  const wrongRegex = new RegExp(wrongQemu);
  if (wrongRegex.test(script)) {
    failures.push(`${hwId}: Found wrong QEMU binary ${wrongQemu} in script`);
  }
}

if (failures.length > 0) {
  console.error('QEMU binary selection test failures:');
  for (const f of failures) {
    console.error(`  ${f}`);
  }
  process.exit(1);
}

console.log('All QEMU binary selection tests passed!');
