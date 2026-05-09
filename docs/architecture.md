# Architecture

OSDB is a static web application — no backend. The entire wizard runs in the browser, generates a bash Build Script as a string, and hands it to the user. The generated script self-containerises via Docker or Podman at runtime and invokes the distro's Build Tool to produce an ISO or IMG.

This document is for contributors. For usage instructions see the [README](../README.md) and [HOWTO.md](../HOWTO.md).

---

## Module map

### Data layer (`docs/wizard.js` — lines 1–800)

| Name | Type | What it is |
|------|------|------------|
| `BASES` | Object | ~30 Base definitions. Each has: `family`, `suite`, `track`, `builder`, `pkg` (package manager), `mirror`, `des` (supported DEs), `installers`, `repoTypes`, `serviceManager`, `eol`. |
| `DE_PACKAGES` | Object | Maps each DE ID → package string per package manager. |
| `PACKAGES` | Array | 21 optional package toggles. Each has `families`, `pkgName` per manager, `defaultOn`. |
| `SERVICES` | Array | 11 system service toggles. Each has `unit`, `rcName`, `families`, `defaultOn`, `pkgName`. |
| `TRACK_STABILITY` / `isStableTrack()` | Map / predicate | One source of truth for Track stability, used by both UI filtering and stable test matrix generation. |

### State & UI (`docs/wizard.js` — lines ~564–750)

`state` is the single runtime object all Generators read:

```js
state = {
  base, de, distroName,
  rpiHardware,            // Raspberry Pi only
  pkgPreset, presetCorePkgs, pkgs,
  repoType, customMirrorUrl, ppaList,
  installer,
  services,
  configTxt               // Raspberry Pi config.txt flags
}
```

`getSteps()` returns the wizard step definitions. RPi Bases get an extra Hardware step inserted after Base selection.

### Generators (`docs/wizard.js` — lines ~1526–2918)

`generateScript()` reads `BASES[state.base].builder` and dispatches to the matching Generator:

| Generator | Build Tool | Distro family |
|-----------|-----------|---------------|
| `generateLiveBuild()` | live-build | Debian, Ubuntu |
| `generateArchiso()` | archiso | Arch Linux, Arch ARM |
| `generateLorax()` | lorax | Fedora |
| `generatePiGen()` | pi-gen | Raspberry Pi OS |
| `generateUbuntuRpi()` | ubuntu-rpi | Ubuntu for RPi |
| `generateAlarmRpi()` | alarm-rpi | Arch Linux ARM (Pi 4/5) |
| `generateKiwi()` | kiwi | openSUSE |
| `generateCatalyst()` | catalyst | Gentoo |

Every Generator calls these shared helpers:

| Helper | Returns |
|--------|---------|
| `containerPreamble(image)` | Docker/Podman self-relaunch block |
| `scriptHeader(name, builder, image)` | Bash header: logging, trap, dir init, cleanup |
| `dePkgs(base)` | DE package string for this Base's package manager |
| `enabledPkgList(base)` | Toggled packages + Core Package Set, resolved to this manager |
| `enabledServicesList()` | systemd unit names to enable |
| `enabledServicePkgList(base)` | Packages those services require |

### Environment Profiles (`docs/environments/`)

```
docs/environments/{baseId}_environment_profiles/
  01_minimum_headless_optional_de/environment.md
  02_standard_server_headless_optional_de/environment.md
  03_standard_desktop_selectable_de/environment.md
  04_standard_gaming_selectable_de/environment.md
  05_standard_education_selectable_de/environment.md
  06_standard_coding_environment_selectable_de/environment.md
  07_standard_practical_maximum_selectable_de/environment.md
  08_llm_ai_workstation_inference_server/environment.md   ← not all Bases have this
```

Each `environment.md` contains a `## Core Package Set` fenced block. `loadPresetsForBase()` fetches these at runtime and populates `state.presetCorePkgs` when the user selects a Quick Preset.

### Test suite (`scripts/tests/`)

```
scripts/tests/
  lib/osdb-wizard-harness.cjs       ← loads wizard.js in Node vm; exposes generateScript
  generate-stable-base-tests.cjs    ← generates stable/{baseId}.sh for each stable Base × DE
  run-stable-default-matrix.cjs     ← runs all stable tests in-process (Windows-friendly)
  run-stable-default-matrix.sh      ← bash runner called by CI
  run-snapshot-tests.cjs            ← diffs fresh canonical output against stored snapshots
  update-snapshots.cjs              ← regenerates all snapshot files from current wizard output
  validate-environment-packages.cjs ← validates environment.md Core Package Sets
  sort-environment-core-packages.cjs← sorts package lists alphabetically in-place
  stable/                           ← auto-generated test scripts — do not edit by hand
  snapshots/                        ← committed snapshot files — one per stable non-EOL Base
```

The Wizard Harness strips the `DOMContentLoaded` listener from `wizard.js` and exposes `generateScript`, `BASES`, `PACKAGES`, `SERVICES`, `state`, `initDefaultPkgs`, `initDefaultServices` for use in Node without a browser.

### Snapshot Tests

Each stable non-EOL Base has a committed reference Build Script at `scripts/tests/snapshots/{baseId}.sh`. These are generated from a **Canonical Config**: the default DE, `repoType: 'official'`, default packages, default services, and the best available installer for that Base.

`run-snapshot-tests.cjs` regenerates each Build Script from the current wizard output, then normalizes both the freshly generated script and the stored reference (timestamp placeholder, CRLF → LF, trailing newline) before diffing them. Any difference fails CI immediately and prints a unified diff of the first failure.

Committed snapshot `.sh` files are enforced as LF-only via `.gitattributes` (`scripts/tests/snapshots/*.sh text eol=lf`) to avoid line-ending-only churn across contributor environments. The normalization step remains as a safety net for generated output and local editor/checkout drift.

**Updating snapshots intentionally** (e.g. after a deliberate Generator change):

```bash
node scripts/tests/update-snapshots.cjs
```

Then commit the updated files in `scripts/tests/snapshots/` alongside the wizard change.

**Important**: All generated `.sh` files under `scripts/tests/` must have mode `755`. The `update-snapshots.cjs` and `generate-stable-base-tests.cjs` scripts use `fs.chmodSync(outFile, 0o755)` after writing to ensure correct permissions. CI enforces this requirement.

### Generator Variable Requirements

All generator functions in `wizard.js` that use shell variables must define them before use, especially when scripts run with `set -u`:

- **CONFIG_TXT**: Used by `buildConfigTxt()` for Raspberry Pi builds. Must be defined before any `echo "..." >> "${CONFIG_TXT}"` lines.
  - pi-gen (rpios): `CONFIG_TXT="/boot/firmware/config.txt"` with fallback
  - ubuntu-rpi: `CONFIG_TXT="${ROOTFS}/boot/firmware/config.txt"`
  - rpi-arch: `CONFIG_TXT="${BUILD_DIR}/boot/config.txt"`

CI runs `test-config-txt-definition.cjs` to verify all generators that reference `${CONFIG_TXT}` define it before use.

### CI (`.github/workflows/`)

| Workflow | Trigger | What it does |
|----------|---------|-------------|
| `stable-matrix.yml` | Push/PR touching `wizard.js` or `scripts/tests/` | Snapshot tests → regenerates test scripts → verifies permissions → git diff check → runs matrix |
| `pages.yml` | Push to main touching `docs/` | Deploys `docs/` to GitHub Pages |
| `shellcheck.yml` | Push/PR touching `scripts/examples/` | ShellChecks reference scripts |
| `markdown-links.yml` | All pushes/PRs to `main` | Fails CI on broken local markdown links (external links ignored) |

---

## Data flow

```
User opens docs/index.html
  → fills 7-step form (Base, DE, Packages, Repository, Installer, Services, Summary)
  → state populated

generateScript()
  → BASES[state.base].builder → dispatch to Generator
  → Generator calls helpers → returns bash string

Browser renders bash in <textarea>
User copies one-liner or downloads script

User runs script as root:
  → if not in container: re-exec via docker/podman --privileged
  → inside container: Build Tool builds ISO/IMG → output written to OUTPUT_DIR
  → SHA256 checksum generated alongside ISO/IMG
```

---

## How to add a new distro

### 1. Add a Base entry

In `docs/wizard.js`, add to the `BASES` object:

```js
'void-linux': {
  label: 'Void Linux',
  family: 'void',
  suite: 'current',
  track: 'rolling',
  builder: 'xbps-src',      // must match a Generator — see step 3
  pkg: 'xbps',
  mirror: 'https://repo-default.voidlinux.org/current',
  des: ['gnome', 'kde', 'xfce', 'none'],
  installers: ['none'],
  repoTypes: ['official', 'custom'],
  serviceManager: 'runit',
  eol: false,
},
```

Key fields:

- `family` — used to filter `PACKAGES` and `SERVICES`; add `'void'` to the `families` array of any package or service you want available for this distro
- `builder` — must match the string used in `generateScript()`'s dispatch
- `pkg` — package manager key used in `DE_PACKAGES` and `PACKAGES[n].pkgName`
- `track` — determines whether the Base appears in the stable test matrix (`isStableTrack(track)`)

### 2. Add DE package names

In `DE_PACKAGES`, add your package manager key to each DE the new distro supports:

```js
kde: {
  apt: 'kde-plasma-desktop ...',
  pacman: 'plasma ...',
  xbps: 'KDE5 ...',    // ← add this
},
```

Add `xbps` entries to any `PACKAGES[n].pkgName` and `SERVICES[n].pkgName` objects where the new distro should offer that package or service.

### 3. Write the Generator

Add `generateXbpsSrc(base, name)` and wire it into `generateScript()`:

```js
case 'xbps-src':
  return generateXbpsSrc(base, state.distroName);
```

Every Generator must call:

- `scriptHeader(name, 'xbps-src', containerImage)` — bash boilerplate
- `containerPreamble(containerImage)` — Docker/Podman self-relaunch block
- `enabledPkgList(base)` — user-selected packages resolved to this manager
- `enabledServicesList()` — services to enable
- `serviceEnableBlock(units)` — systemd enable snippet (or the OpenRC/runit equivalent)

Use `generateArchiso` as a reference for rolling distros; use `generateLiveBuild` for Debian-style apt-heavy builds.

### 4. Create Environment Profiles

```
docs/environments/void-linux_environment_profiles/
  01_minimum_headless_optional_de/environment.md
  02_standard_server_headless_optional_de/environment.md
  03_standard_desktop_selectable_de/environment.md
  ...
```

Each `environment.md` must contain:

~~~markdown
## Core Package Set
```text
package-one
package-two
```
~~~

Validate with:

```bash
node scripts/tests/validate-environment-packages.cjs
```

### 5. Regenerate and run tests

The test matrix is generated automatically from `BASES`. If your new Base has a Track that `isStableTrack(track)` considers stable, `generate-stable-base-tests.cjs` will include it.

```bash
node scripts/tests/generate-stable-base-tests.cjs
bash scripts/tests/run-stable-default-matrix.sh
```

Also update snapshots for the new Base:

```bash
node scripts/tests/update-snapshots.cjs
```

### 6. Update the README

Add the new Base to the **Supported bases** table in `README.md`.

---

## Running tests locally

Run snapshot tests:

```bash
node scripts/tests/run-snapshot-tests.cjs
```

Generate and run the stable base matrix:

```bash
node scripts/tests/generate-stable-base-tests.cjs
bash scripts/tests/run-stable-default-matrix.sh
```

Windows (no bash required):

```powershell
node .\scripts\tests\run-stable-default-matrix.cjs
# or:
.\scripts\tests\run-stable-default-matrix.ps1
```

Validate Environment Profile Core Package Sets:

```bash
node scripts/tests/validate-environment-packages.cjs
```

Sort package lists alphabetically in-place:

```bash
node scripts/tests/sort-environment-core-packages.cjs
```

Check local markdown links (external URLs ignored):

```bash
node scripts/tests/test-markdown-local-links.cjs
```

ShellCheck reference scripts (requires [shellcheck](https://www.shellcheck.net/)):

```bash
shellcheck scripts/examples/*.sh
```
