# Mirror Self-Healing Strategy

Generated Build Scripts embed a curated per-distro Fallback Mirror list and implement Self-Healing at runtime: on a Checksum Failure, retry the primary Mirror twice, then perform a Clean Restart for each Fallback Mirror in order, and hard-fail with a diagnostic listing every mirror tried if all are exhausted.

## Considered Options

- **Runtime mirror selection** — fetch the distro's official mirror list at build time and pick the fastest. Rejected: adds a network dependency before the build starts, and "fastest at this moment" does not mean "has consistent checksums."
- **Prompt the user** — pause and ask for a custom mirror URL on failure. Rejected: breaks unattended and CI builds.
- **Fail immediately** — no retry, no fallback. Rejected: transient network errors and temporarily stale mirrors are common enough that silent failure wastes significant build time with no actionable output.

## Consequences

Self-Healing is only implemented for `live-build` and `archiso` initially. Other Build Tools (`lorax`, `pi-gen`, `kiwi`, `catalyst`, `alarm-rpi`) fail immediately on Checksum Failure until extended.
