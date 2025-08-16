#!/usr/bin/env bash
# Check for duplicate server/route directory layouts that cause ambiguity
# - This script fails (exit code 2) when pairs of duplicate directories are present.
# - Intended to be run in CI and locally.

set -euo pipefail

duplicates=()

check_pair() {
  a="$1"
  b="$2"
  label="$3"
  if [ -d "$a" ] && [ -d "$b" ]; then
    echo "ERROR: Duplicate directories found for $label:" >&2
    echo "  - $a" >&2
    echo "  - $b" >&2
    duplicates+=("$a|$b")
  fi
}

# Common ambiguous pairs we want to prevent
check_pair "server" "src/server" "server (root vs src/server)"
check_pair "routes" "src/routes" "routes (root vs src/routes)"
check_pair "server/routes" "src/server/routes" "server/routes vs src/server/routes"
check_pair "src/routes" "src/server/routes" "src/routes vs src/server/routes"

if [ ${#duplicates[@]} -gt 0 ]; then
  echo "" >&2
  echo "To fix: consolidate into 'src/server' (recommended canonical location) and remove the duplicate directory. See docs/server-layout.md for a migration checklist." >&2
  echo "Run this script locally to validate after making changes: bash ./scripts/check-server-layout.sh" >&2
  exit 2
else
  echo "OK: No duplicate server/route directories detected."
fi
