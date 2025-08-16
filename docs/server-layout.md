# Server layout consolidation

This project enforces a single canonical location for server code to avoid duplication and conflicting import paths. Duplicates commonly appear as a mix of top-level and src/ directories:

- server/  (top-level)
- routes/  (top-level)
- src/server/
- src/server/routes/
- src/routes/

Recommendation
- Canonical layout: src/server (and src/server/routes for route files).
- Reasons: keeps source code under src/, aligns with common build/tooling patterns, and reduces ambiguity for imports.

CI check
- A lightweight check (scripts/check-server-layout.js) is added and run in CI to detect ambiguous/duplicate server & routes directories and fail the build until the repository is consolidated.

Migration steps (example)
1) Choose canonical target: src/server

2) Move files with git to preserve history:

  # move a top-level server into src/server
  mkdir -p src
  git mv server src/server

  # move top-level routes under src/server
  git mv routes src/server/routes

  # or move src/routes into src/server/routes
  git mv src/routes src/server/routes

3) Update imports that referenced the old paths (search for require/import patterns). Prefer relative imports from the new location or update path aliases.

4) Run tests and CI. The check script will fail if ambiguous duplicates remain.

Guidance for reviewers
- When reviewing PRs that add or move server code, ensure changes use the canonical path (src/server). If a PR introduces both server/ and src/server/ or routes/ and src/server/routes/, request consolidation.

If you need help migrating larger codebases or want to adopt a different canonical layout, document the chosen layout here and update the CI check script accordingly.