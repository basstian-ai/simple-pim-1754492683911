# Server layout (canonical)

Chosen canonical location for server-side application code: src/server

Why
- Keeps source files under src/ (consistent with modern JS/TS conventions).
- Avoids duplication and import confusion when consumers import top-level vs namespaced paths.

Rules enforced by CI
- Do not have both server/ and src/server/ in the repository simultaneously.
- Do not have both src/routes/ and src/server/routes/ simultaneously.

If CI fails
1. Move files from the non-canonical location into src/server (keep history via git mv when possible):
   - git mv server/* src/server/   (or)
   - git mv src/routes/* src/server/routes/
2. Update imports (examples):
   - from require('../server/foo')  -> require('../src/server/foo')
   - or better: from '@/server/foo' if the repo uses path aliases; run your repo's codemod or search/replace.
3. Run the layout check locally: node scripts/check-server-layout.js

Migration tips
- Use git mv to preserve history when moving files.
- If many imports need updating, consider running a small codemod (jscodeshift) or a disciplined search/replace.

CI
- A lightweight check script is run in CI to prevent regressions. The goal is to make merges that reintroduce duplicate folders fail fast and with a clear message.

If you believe an exception is required (very rare)
- Add a documented rationale in an engineering RFC and update docs/server-layout.md to include the exception and add a TODO to the CI script to allow that pattern explicitly.
