#!/usr/bin/env bash
set -euo pipefail

echo "Starting packaging validation..."

if [ -f package.json ]; then
  echo "Found package.json"
else
  echo "No package.json found. If this is a Next.js project, ensure package.json is present."
fi

if [ -f pyproject.toml ] || [ -f setup.py ]; then
  echo "Python packaging files detected."
fi

echo "Checking local test runner (pytest)..."
if command -v pytest >/dev/null 2>&1; then
  echo "pytest available locally"
else
  echo "pytest not found locally — install pytest to run tests locally or use 'make docker-test' to run tests in Docker."
fi

echo "Packaging validation complete."
exit 0
