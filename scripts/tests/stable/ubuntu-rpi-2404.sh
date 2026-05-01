#!/usr/bin/env bash
set -euo pipefail

FAILS=()
BASE_ID="ubuntu-rpi-2404"
DES=("gnome" "kde" "xfce" "mate" "none")

for DE in "${DES[@]}"; do
  TMP_SCRIPT="$(mktemp)"
  TMP_LOG="$(mktemp)"
  if ! node - "$BASE_ID" "$DE" "$TMP_SCRIPT" >"$TMP_LOG" 2>&1 <<'NODE_EOF'
const fs = require('fs');
const path = require('path');
const baseId = process.argv[2];
const de = process.argv[3];
const outFile = process.argv[4];
const { loadWizard } = require(path.resolve(process.cwd(), 'scripts/tests/lib/osdb-wizard-harness.cjs'));
const { BASES, state, initDefaultPkgs, initDefaultServices, generateScript } = loadWizard();
const base = BASES[baseId];
state.base = baseId;
state.de = de;
state.distroName = 'test-' + baseId + '-' + de;
state.repoType = 'official';
state.customMirrorUrl = '';
state.ppaList = '';
state.installer = "calamares";
state.rpiHardware = (base.family === 'rpi' || base.family === 'rpi-ubuntu' || base.family === 'rpi-arch') ? 'rpi4' : null;
initDefaultPkgs();
initDefaultServices();
fs.writeFileSync(outFile, generateScript(), 'utf8');
NODE_EOF
  then
    FAILS+=("$BASE_ID/$DE:generate_error")
    rm -f "$TMP_SCRIPT" "$TMP_LOG"
    continue
  fi

  if ! grep -Fq "firefox" "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_pkg:firefox"); fi
  if ! grep -Fq "chromium-browser" "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_pkg:chromium-browser"); fi
  if ! grep -Fq "vlc" "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_pkg:vlc"); fi
  if ! grep -Fq "git" "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_pkg:git"); fi
  if ! grep -Fq "cups" "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_pkg:cups"); fi
  if ! grep -Fq "network-manager" "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_service_pkg:network-manager"); fi
  if ! grep -Fq "cups" "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_service_pkg:cups"); fi
  if ! grep -Fq "bluez" "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_service_pkg:bluez"); fi
  if ! grep -Fq "unattended-upgrades" "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_service_pkg:unattended-upgrades"); fi
  if ! grep -Fq "rpi-eeprom" "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_service_pkg:rpi-eeprom"); fi
  if ! grep -Fq "NetworkManager.service" "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_service_unit:NetworkManager.service"); fi
  if ! grep -Fq "cups.service" "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_service_unit:cups.service"); fi
  if ! grep -Fq "bluetooth.service" "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_service_unit:bluetooth.service"); fi
  if ! grep -Fq "unattended-upgrades.service" "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_service_unit:unattended-upgrades.service"); fi
  if ! grep -Fq "rpi-eeprom-update.service" "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_service_unit:rpi-eeprom-update.service"); fi

  rm -f "$TMP_SCRIPT" "$TMP_LOG"
done

if [ "${#FAILS[@]}" -gt 0 ]; then
  for f in "${FAILS[@]}"; do
    echo "$f"
  done
  exit 1
fi
