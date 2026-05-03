#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { loadWizard } = require('./lib/osdb-wizard-harness.cjs');
const { buildDefaultPkgs, buildDefaultServices, getEnabledPackages, getEnabledServicePackages, getEnabledServiceUnits } = require('./lib/pkg-resolution.cjs');

const outDir = path.resolve(__dirname, 'stable');
fs.mkdirSync(outDir, { recursive: true });

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

const generated = [];

for (const baseId of stableBaseIds) {
  const base = BASES[baseId];
  const des = Array.isArray(base.des) && base.des.length ? base.des : ['none'];

  const defaultPkgs = buildDefaultPkgs(base, PACKAGES);
  const defaultServices = buildDefaultServices(base, SERVICES);
  const defaultPkgTokens = getEnabledPackages(base, defaultPkgs, [], PACKAGES);
  const defaultSvcPkgTokens = getEnabledServicePackages(base, defaultServices, SERVICES, baseId);
  const expectedUnits = getEnabledServiceUnits(base, defaultServices, SERVICES, baseId);

  const content = `#!/usr/bin/env bash
set -euo pipefail

FAILS=()
BASE_ID=${JSON.stringify(baseId)}
DES=(${des.map((d) => JSON.stringify(d)).join(' ')})

for DE in "\${DES[@]}"; do
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
state.installer = ${JSON.stringify(installerFor(base))};
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

  if ! bash -n "$TMP_SCRIPT" 2>/dev/null; then
    FAILS+=("$BASE_ID/$DE:bash_syntax_error")
    rm -f "$TMP_SCRIPT" "$TMP_LOG"
    continue
  fi

${defaultPkgTokens.map((pkg) => `  if ! grep -Fq ${JSON.stringify(pkg)} "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_pkg:${pkg}"); fi`).join('\n')}
${defaultSvcPkgTokens.map((pkg) => `  if ! grep -Fq ${JSON.stringify(pkg)} "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_service_pkg:${pkg}"); fi`).join('\n')}
${expectedUnits.map((unit) => `  if ! grep -Fq ${JSON.stringify(unit)} "$TMP_SCRIPT"; then FAILS+=("$BASE_ID/$DE:missing_default_service_unit:${unit}"); fi`).join('\n')}

  rm -f "$TMP_SCRIPT" "$TMP_LOG"
done

if [ "\${#FAILS[@]}" -gt 0 ]; then
  for f in "\${FAILS[@]}"; do
    echo "$f"
  done
  exit 1
fi
`;

  const outFile = path.join(outDir, `${baseId}.sh`);
  fs.writeFileSync(outFile, content, 'utf8');
  fs.chmodSync(outFile, 0o755);
  generated.push(path.relative(path.resolve(__dirname, '..', '..'), outFile).replace(/\\/g, '/'));
}

const runner = `#!/usr/bin/env bash
set -euo pipefail

FAIL=0
while IFS= read -r script; do
  if ! bash "$script"; then
    FAIL=1
  fi
done < <(find "$(cd "$(dirname "$0")/stable" && pwd -P)" -maxdepth 1 -type f -name '*.sh' | sort)

exit "$FAIL"
`;

fs.writeFileSync(path.resolve(__dirname, 'run-stable-default-matrix.sh'), runner, 'utf8');
fs.chmodSync(path.resolve(__dirname, 'run-stable-default-matrix.sh'), 0o755);

console.log(`Generated ${generated.length} base test scripts.`);
for (const g of generated) {
  console.log(g);
}
