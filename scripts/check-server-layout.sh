#!/usr/bin/env bash
set -euo pipefail

# Check for duplicate server/route directories to enforce a single canonical source
# Exit codes:
# 0 - ok
# 2 - consolidation problem found

duplicates=0

# Helper to print a recommendation block
print_recommendation() {
  cat <<EOF

Recommendation:
 - Pick a single canonical location for server code. We recommend: src/server
 - Move files with: git mv server src/server
 - Update imports/paths (examples in docs/server-layout.md)
 - Run this check again and ensure CI passes

EOF
}

# Check pairs described in the roadmap task
if [ -d "server" ] && [ -d "src/server" ]; then
  echo "ERROR: Both 'server/' and 'src/server/' directories exist."
  echo "This repository has duplicate server code paths. Please consolidate into a single canonical location (prefer 'src/server/')."
  duplicates=1
fi

if [ -d "src/routes" ] && [ -d "src/server/routes" ]; then
  echo "ERROR: Both 'src/routes/' and 'src/server/routes/' directories exist."
  echo "These appear to be duplicate route trees. Consolidate routes under the canonical server location (prefer 'src/server/routes/')."
  duplicates=1
fi

if [ -d "server/routes" ] && [ -d "src/server/routes" ]; then
  echo "ERROR: Both 'server/routes/' and 'src/server/routes/' directories exist."
  echo "Consolidate to a single routes directory under the canonical server layout."
  duplicates=1
fi

if [ $duplicates -ne 0 ]; then
  print_recommendation
  echo "Consolidation check failed."
  exit 2
fi

echo "Server layout check passed. No duplicate server/route directories detected."
exit 0
