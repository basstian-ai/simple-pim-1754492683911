


## Progress

- +- Improved lib/slugify.js:
- +  - Replaced placeholder implementation with a robust slugifier that:
- +    - Removes diacritics using Unicode normalization
- +    - Trims leading/trailing hyphens and supports optional max length
- +  - Exported multiple shapes to improve CommonJS/ES interop:
- +  - Added small _impl diagnostics object for debugging
- +
- +
- - lib/slugify.js
- - Replaced placeholder implementation with a robust slugifier:
- - Removes diacritics via Unicode normalization (fallback table when unavailable).
- - Lowercases, collapses non-alphanumeric sequences into hyphens, trims, and supports optional maxLength.
- - Exports multiple shapes for interoperability:
- - module.exports = slugify
- - module.exports.slugify = slugify
- - module.exports.default = slugify
- - exports.slugify = slugify
- - Adds small _impl and _version fields for debugging.
- - Purpose: improves reliability of slug generation across the codebase and ensures both default and named import styles work (addresses roadmap interop goal).
  - module.exports = slugify
  - module.exports.slugify = slugify
  - module.exports.default = slugify
- Purpose: Ensure codebase files that both default-import and require slugify work reliably (addresses import/export compatibility and the roadmap item to provide predictable utility exports).

## Next Steps

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
- +- Add unit tests for slugify edge cases (accents, punctuation, empty input, long input) — e.g., tests/slugify.test.js.
- +- Audit other core utility modules (lib/isInStock, lib/exportCsv, lib/products) to ensure they expose friendly interop shapes; add shims where needed.
- +- Run full test suite (npm test) in CI to detect interop mismatches across the codebase.
- +- Optionally add a small integration test calling pages/api/slugify and pages/tools/slugify to guard against regressions in different runtime environments.
- 1. Add unit tests for slugify edge cases (accents, punctuation, repeated separators, empty input, long input) — e.g., tests/slugify.test.js.
- 2. Audit other core utility modules for export interop (lib/isInStock.js, lib/exportCsv.js, lib/products.js). Add similar shims where consumers import with mixed styles.
- 3. Run full test-suite (npm test / CI) to discover any remaining import/export mismatches.
- 4. Optionally consolidate health endpoints into a single health hub and add readiness/health tests as noted in roadmap.
- 5. Consider adding a small lint/CI check to detect critical utilities missing default/named exports to prevent regressions.
