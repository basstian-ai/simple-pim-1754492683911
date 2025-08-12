


## Progress

- - lib/exportCsv.js
- - Improved robustness when resolving the isInStock utility:
- - Accepts function exported directly, named export isInStock, or default export.
- - Falls back to a conservative in-memory heuristic if the module shape is unexpected.
- - Ensures CSV serializer remains available through multiple common CommonJS/ESM shapes (module.exports, .default, .toCsv, etc.).
- - Adds a trailing newline to generated CSV for better compatibility with tools.
- - Fixed/improved lib/slugify.js:
- - Replaced placeholder implementation with robust slugifier that:
- - Removes diacritics using String.prototype.normalize when available
- - Lowercases, trims, collapses non-alphanumeric sequences into hyphens
- - Trims leading/trailing hyphens and enforces optional max length
- - Exposed multiple export shapes for interoperability:
- - module.exports = slugify
- - module.exports.slugify = slugify
- - module.exports.default = slugify
- - exports.slugify = slugify
- - Added small _impl and _version fields for debugging
- - Roadmap alignment:
- - Implements the known-safe pattern to support both default and named imports of lib/slugify so API routes and pages using different import styles won't fail at runtime.
  - module.exports = slugify
  - module.exports.slugify = slugify
  - module.exports.default = slugify
- Purpose: Ensure codebase files that both default-import and require slugify work reliably (addresses import/export compatibility and the roadmap item to provide predictable utility exports).

## Next Steps

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
- - Add a unit test (tests/slugify.test.js) covering edge cases: accents, punctuation, repeated separators, empty input, long input.
- - Run full test suite in CI (npm test) to ensure no other import/export interop issues exist.
- - Audit other core utilities for consistent export shapes (lib/isInStock, lib/products, lib/exportCsv) and add shims where necessary.
- - Consider adding a small CI lint rule to detect when critical utilities (slugify, exportCsv) do not expose both default and named exports to prevent regressions.
- - Optionally consolidate health endpoints into a single health hub and add unit tests for readiness/health probes.
