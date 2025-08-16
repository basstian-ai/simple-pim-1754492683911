# Server layout and consolidation guide

Canonical decision

- This repository uses a single canonical server location: `src/server`.
- Routes should be colocated under `src/server/routes`.

Why

- Keeping server code under `src/` matches the rest of the source tree and avoids duplication/confusion between top-level build/runtime helpers and the application server.
- Having a single canonical path reduces import ambiguity, accidental duplicate implementations, and CI/runtime surprises.

What this change adds

- A lightweight CI check (scripts/check-duplicate-server.mjs) that detects duplicate server and routes directories and fails the build if duplicates are present.
- A GitHub Actions workflow to exercise the check on push and PRs (.github/workflows/check-server-layout.yml).

Migration steps (safe, manual)

1. Choose the canonical directory: `src/server`.
2. If you currently have a top-level `server/` directory, move its files into `src/server/` preserving relative paths. Example:
   - `server/index.ts` -> `src/server/index.ts`
   - `server/lib/*` -> `src/server/lib/*`
3. If you have `src/routes/` move those files into `src/server/routes/`.
4. Update local imports that referenced the old paths. Example: `import foo from '../../server/foo'` may need to become `import foo from '../../src/server/foo'` depending on your build config — prefer paths relative to `src/`.
5. Run the check locally: `node ./scripts/check-duplicate-server.mjs` — it will exit non-zero if duplicates remain.
6. Run the project's tests and local dev server to ensure nothing broke.
7. Commit the refactor and push; CI will enforce there are no duplicate server/route directories.

Notes & rationale

- This change intentionally does not automatically move code or rewrite imports. Automated mass-rewrites can be risky. The CI check prevents regressions and helps teams coordinate a deliberate, tested consolidation.
- If your repo already follows the canonical layout, no action is needed.

If you need help migrating a large codebase, open a short-lived task/PR describing the planned moves and we'll review the import changes and follow-up fixes.
