


## Progress

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
- - lib/slugify.js: replaced implementation with more robust slugifier that removes diacritics, normalizes, collapses non-alphanumeric runs, and exposes multiple export shapes (module.exports, .slugify, .default, and ._impl)
- - This improves interoperability for modules that default-import or named-import slugify (fixes potential runtime errors when consumers use different import styles).
- - lib/exportCsv.js
- - Improved robustness when resolving the isInStock utility:
- - Accepts function exported directly, named export isInStock, or default export.
- - Falls back to a conservative in-memory heuristic if the module shape is unexpected.
- - Ensures CSV serializer remains available through multiple common CommonJS/ESM shapes (module.exports, .default, .toCsv, etc.).
- - Adds a trailing newline to generated CSV for better compatibility with tools.
  - module.exports = slugify
  - module.exports.slugify = slugify
  - module.exports.default = slugify
- Purpose: Ensure codebase files that both default-import and require slugify work reliably (addresses import/export compatibility and the roadmap item to provide predictable utility exports).

## Next Steps

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
- - Add unit tests verifying slugify behavior for edge cases (accents, punctuation, whitespace, empty input) — tests/slugify.test.js
- - Audit other core utilities for consistent export shapes (lib/products.js, lib/isInStock.js) and add interop shims where needed.
- - Add CI check to run the test suite to catch import/export mismatches early.
- - Consider consolidating health endpoints into a single health hub and add unit tests for /api/health-hub to cover success and failure cases.
- - Add a small interop unit test to assert lib/isInStock shapes (default vs named) are accepted by lib/exportCsv.
- - Audit other core utilities for similar import/export interop issues (lib/slugify, lib/isInStock, lib/products) and add compatibility shims where needed.
- - Add CI test that runs the export CSV endpoint and validates headers/columns to catch regressions.
- - Consider harmonizing module export styles across the codebase (prefer consistent CommonJS or ESM) to avoid needing defensive adapters.
