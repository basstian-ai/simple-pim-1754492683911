# Server layout guidance

This project adopts a single canonical server layout to avoid duplicated code paths and confusion when resolving imports, tests, and deployment artifacts.

Recommended canonical layout
- Preferred canonical location: src/server
- Avoid maintaining a parallel top-level server/ directory alongside src/server
- Avoid maintaining duplicate route directories such as src/routes and src/server/routes simultaneously

Why enforce a single layout
- Duplicate directories are a common source of confusion, accidental edits in one copy, and subtle import/build differences.
- Consolidation simplifies CI, code owners, and deployment packaging.

Migration checklist (manual steps)
1. Choose the canonical location. We recommend src/server.
2. Move files from server/ into src/server/ preserving file structure. Example:
   - mkdir -p src/server && mv server/* src/server/
3. Update imports if any reference the old top-level path. Typical fixes:
   - Search for require("../server") or import from "../server" and update to the new relative path.
   - For module paths consumed by tooling, update build configs (tsconfig paths, rollup/webpack config).
4. Update any run scripts or Dockerfiles that reference the old location.
5. Run tests and CI locally to verify no regressions.

Quick grep helpers
- Find imports referencing top-level server:
  - git grep "from\s\+['\"]\./server\|/server\b" || true

CI guard
- A lightweight CI script is provided at tools/check-server-layout.js. It fails CI if it detects both variants present (for the pairs tested). This prevents accidental re-introduction of duplicate paths.

If you need assistance with a migration (large repos with many imports), please open a short task and include examples of failing imports — maintainers can provide a codemod to update paths safely.
