# Server layout convention

Canonical decision
- Use src/server/ as the canonical location for server-side application code.

Why
- Avoids duplicate code paths and ambiguous imports (e.g. imports that reference both "server/" and "src/server/").
- Keeps top-level project root cleaner and groups source under "src/" like other application code.

Migration guidance (safe, manual steps)
1. Create src/server/ if it does not exist.
2. Move files from server/ into src/server/ with a single mv operation where possible:
   - mv server/* src/server/
   - mv server/.??* src/server/  # if you have dotfiles (be cautious)
3. Update import paths in the codebase that referenced the old location. Typical patterns to update:
   - require('../server/...')  -> require('../../src/server/...')  (or use project-relative paths if configured)
   - import ... from '../../server/...' -> import ... from '../../src/server/...'
   Consider mass-rewrites with grep + sed or an editor-aware refactor. Run the test suite after changes.
4. Remove the old directory after verifying tests and runtime behavior:
   - rm -rf server

CI guard
- A small CI check (scripts/check-server-layout.js) will fail if both server/ and src/server/ exist. This is intended to prevent accidental duplication and regressions.

If you prefer the opposite canonical layout (server/ at project root), document it here and update the CI check accordingly. The main goal is to have a single canonical directory for server code.
