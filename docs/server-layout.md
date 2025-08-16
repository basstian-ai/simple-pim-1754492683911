# Server layout guideline

Canonical layout: src/server

Rationale:
- Keeps server code colocated with source, consistent with TypeScript/ESM projects.
- Avoids ambiguity between top-level server/ and src/server/ which can cause duplicate runtime codepaths, confusing imports, and deployment differences.

What this change adds:
- A lightweight checker (scripts/check-server-layout.js) that fails CI if both server/ and src/server/ (or src/routes vs src/server/routes) exist.
- A small test harness (tests/check-server-layout.test.js) that validates the checker.

Migration steps (suggested):
1) Pick the canonical location (recommended: src/server).
2) Move files from server/ into src/server/ preserving history: git mv server/* src/server/ or create src/server and git mv.
3) Update imports that referenced '/server' to '/src/server' or to the new relative import paths. Use a codemod or automated search/replace where possible.
4) Remove the old server/ directory once all references are updated.
5) Run the layout check and CI to ensure no duplicate directories remain.

CI protection:
- A workflow is included to run the layout check on PRs and pushes. This prevents accidental re-introduction of duplicate server/route trees.

If you need help migrating large codebases, consider using ts-morph, jscodeshift, or ripgrep + script-based replace to update imports reliably.
