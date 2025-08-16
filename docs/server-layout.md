# Canonical server & routes layout

This project enforces a single canonical location for server code and routes to avoid confusing duplicate code paths, import drift, and accidental edits in the wrong place.

Chosen canonical layout (recommended):

- Server code: src/server
- Routes: src/server/routes

Why this layout?

- Keeps application code inside src/ (common convention for build tools and editors)
- Groups server concerns under a single directory to make imports predictable

Migration guidelines

1. Pick the canonical folder (recommended: src/server).
2. Move files from non-canonical locations (e.g. server/ or src/routes/) into src/server (or src/server/routes).
3. Update imports in the codebase that referenced the old paths.
4. Remove the now-empty legacy directories.
5. Run the repository check:
   - Locally: node scripts/check-duplicate-servers.js
   - CI will also run the check automatically on PRs.

If you need to preserve the old path temporarily (e.g. for a multi-PR migration), keep the check failing state visible and coordinate a short-lived plan to converge into the canonical layout.

Automation

A CI guard (GitHub Actions) is included that will fail the build if conflicting directories are present. This prevents regressions where someone introduces a parallel server/route path.
