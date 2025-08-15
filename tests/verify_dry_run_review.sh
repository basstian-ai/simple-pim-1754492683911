#!/usr/bin/env bash
# Lightweight verification script for repo maintainers/CI to confirm review artifacts exist.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

MISSING=0

check_file() {
  local file="$1"
  if [ ! -f "$ROOT_DIR/$file" ]; then
    echo "[FAIL] missing file: $file"
    MISSING=1
  else
    echo "[OK] found: $file"
  fi
}

check_contains() {
  local file="$1"
  local pattern="$2"
  if ! grep -q -- "$pattern" "$ROOT_DIR/$file"; then
    echo "[FAIL] $file does not contain required text: $pattern"
    MISSING=1
  else
    echo "[OK] $file contains: $pattern"
  fi
}

check_file ".github/PULL_REQUEST_TEMPLATE.md"
check_file "docs/code-review/dry-run-json-preview-checklist.md"
check_file "docs/code-review/meeting-template.md"

check_contains ".github/PULL_REQUEST_TEMPLATE.md" "Dry-Run JSON Preview"
check_contains "docs/code-review/dry-run-json-preview-checklist.md" "Dry-Run JSON Preview — Code Review Checklist"

if [ "$MISSING" -ne 0 ]; then
  echo "\nOne or more verification checks failed. Please address the failures above."
  exit 2
fi

echo "\nAll dry-run review artifacts verified."
