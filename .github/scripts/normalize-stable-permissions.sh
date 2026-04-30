#!/usr/bin/env bash
set -euo pipefail

# Normalize permissions of stable test scripts
find scripts/tests/stable -name '*.sh' -exec chmod 644 {} +
git add scripts/tests/stable/*.sh
git commit -m "fix: normalize script permissions to 644 for stable tests" || echo "No changes to commit"
