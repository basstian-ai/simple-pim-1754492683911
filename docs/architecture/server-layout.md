# Server layout (canonical)

Canonical choice: src/server is the single source of truth for server-side code.

Rationale
- Keeps all application code inside src/ which makes tooling (TS/ESLint/jest) config simpler.
- Avoids ambiguous imports and duplicate runtime behavior when both top-level and src/ copies exist.

Canonical structure (recommended)

- src/
  - server/
    - index.ts (server bootstrap)
    - routes/ (route handlers)
    - controllers/
    - services/
    - middleware/

What this change enforces
- Do not keep a parallel top-level server/ directory alongside src/server/.
- Do not keep both src/routes and src/server/routes; choose src/server/routes.

Migration guidance (manual steps)
1. Choose the canonical directory (src/server). Move files from the legacy location into that tree:
   - Example: git mv server src/server
   - Or: mkdir -p src && git mv server src/server
2. Update imports that referenced the old path. Typical search patterns:
   - grep -R "from '../server" -n
   - grep -R "from '../routes" -n
   - For TypeScript path aliases, update tsconfig.json paths if needed.
3. Run the test suite and local dev server to confirm behavior.
4. Remove the legacy directory after verifying everything works.

How we prevent regressions
- A CI check (scripts/check_server_layout.js) runs on PRs to detect when duplicate server/ or routes/ trees are introduced. If a duplicate layout is present the check fails and provides actionable messages.

If you need help migrating
- Open a PR that moves the files and update imports in that same PR. If the change is large, split into smaller PRs: move files first, then update imports in follow-ups.

Notes
- This document is advisory and intended to be the single canonical source. If you need a different layout for a specific reason, discuss on the PR and update this document accordingly.