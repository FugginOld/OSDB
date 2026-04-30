#!/usr/bin/env bash
set -euo pipefail

FAIL=0
while IFS= read -r script; do
  if ! bash "$script"; then
    FAIL=1
  fi
done < <(find "$(cd "$(dirname "$0")/stable" && pwd -P)" -maxdepth 1 -type f -name '*.sh' | sort)

exit "$FAIL"

