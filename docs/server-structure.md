# Server structure (canonical)

Goal

- Ensure a single canonical location for the server implementation to avoid duplicated code, confusing imports, and deployment surprises.

Canonical layout (chosen by the team)

- src/server/  ← canonical server code root
  - routes/    ← route handlers
  - controllers/
  - middleware/
  - ...

Why this change

- Historical layouts sometimes left a top-level server/ next to src/server/, or placed route files in src/routes and src/server/routes. That duplication leads to drift and bugs.

What we added

- scripts/check-duplicates.js — CI-check that fails when both server/ and src/server/ or both src/routes and src/server/routes exist, or when there are overlapping immediate child names.
- .github/workflows/ensure-single-server.yml — runs the check on PRs and pushes to prevent regressions.

Migration guidance

1. Pick src/server as the canonical path.
2. Move files from server/ into src/server/ preserving relative paths. Example:
   - server/app.js -> src/server/app.js
3. Update imports that referenced '../server' or '/server' to use the new path (search-and-replace); prefer relative imports from the nearest module.
4. Remove the old server/ directory once everything builds and tests pass.

Quick commands

- Run the check locally: node scripts/check-duplicates.js
- Run the script self-tests: node scripts/test-check-duplicates.js

If you need assistance migrating, open a short PR and request a quick review — keep PRs small and list moved files in the description.
