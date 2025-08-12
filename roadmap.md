


## Progress

- - Exposes CommonJS default (module.exports), named export (.slugify), and .default shim for ESM interop
- - Adds internal helper removeDiacritics via module.exports._impl for testing/debugging
- - Implemented export shape compatibility to reduce import errors when codebase mixes require() and import default syntax
- - Added pages/api/health-hub.js
- - New consolidated health + readiness endpoint that:
- - Returns process metadata (uptime, package version, commit)
- - Performs lightweight checks for data/products.json and data/attribute-groups.json
- - Returns 200 when both checks pass, 503 when any check fails
- - Exposes permissive CORS and short edge caching for probes
- - lib/slugify.js
- - Replaced with a robust slugify implementation that:
- - Removes Unicode diacritics using String.prototype.normalize when available
- - Lowercases, trims, replaces non-alphanumeric characters with dashes, collapses repeats
- - Exposes multiple export shapes for interop:
- - module.exports = slugify
- - module.exports.slugify = slugify
- - module.exports.default = slugify
- - exports.slugify = slugify
- - Purpose: ensure callers using either require() or import default (or named) can reliably import slugify without runtime import errors.
  - module.exports = slugify
  - module.exports.slugify = slugify
  - module.exports.default = slugify
- Purpose: Ensure codebase files that both default-import and require slugify work reliably (addresses import/export compatibility and the roadmap item to provide predictable utility exports).

## Next Steps

- - Add tests to ensure other utilities expose consistent default/named exports (slugify, exportCsv, isInStock).
- - Optionally extend readiness to verify optional services (databases, caches) when integrated.
- - Audit other core utilities for consistent export shapes (priority):
- 1. lib/products.js — ensure default and named exports where used
- 2. lib/isInStock.js — confirm named export exists alongside default (it already provides default)
- 3. lib/exportCsv.js — already includes multiple shims; verify consumers use preferred shape
- - Add unit tests verifying slugify behavior (tests/slugify.test.js):
- - accented characters, punctuation, whitespace collapse, underscores, numbers, empty/null input
- - Add CI check that critical utilities expose both default and named exports to prevent regressions
- - Consider consolidating health endpoints into a single health hub for consistency (pages/api/health.*)
- - Update README/developer docs describing import compatibility guidance (require vs import) and how to use provided utility shims
- - Add automated uptime probe (e.g., UptimeRobot) for /api/health-hub to detect data-file regressions.
- - Consolidate other health endpoints (health, health-check, healthz, ready, status) into a small health hub or router to avoid duplication.
- - Add unit tests for /api/health-hub covering success and failure cases.
- - Consider extending readiness checks to validate optional integrations (databases, caches) when those are added.
- - Audit utility exports for consistent default/named shapes (slugify, exportCsv, etc.) and add CI checks to avoid import/export mismatches.
- - Run full test suite (npm test) in CI to catch any ESM/CJS import edge-cases across the codebase.
- - Audit other core utility modules (lib/exportCsv.js, lib/products.js, lib/isInStock.js) for consistent export shapes; add interop shims where consumers import with different styles.
- - Consider adding a small unit test validating slugify behavior for edge cases: accents, punctuation, whitespace, empty input.
- - Optionally consolidate health endpoints into a single health hub (per roadmap) and add readiness/health tests.
