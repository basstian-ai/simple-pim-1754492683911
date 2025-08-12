


## Progress

- - Exposed module.exports._impl.removeDiacritics for debugging/tests.
- - Roadmap item implemented: "Ensure common utilities (slugify, isInStock, exportCsv) export both CommonJS and ESM-compatible defaults for predictable imports." (slugify covered)
- - lib/slugify.js
- - Replaced the simple placeholder implementation with a robust, Unicode-aware slugify function.
- - Normalizes Unicode, strips combining diacritics, collapses non-alphanumeric runs to hyphens, trims edges, and lowercases.
- - Added interoperability exports:
- - module.exports = slugify (CommonJS default)
- - module.exports.slugify = slugify (named)
- - module.exports.default = slugify (ESM interop)
- - exports.slugify = slugify
- - Exposed module.exports._impl.removeDiacritics helper for debugging/testing.
- - "Ensure common utilities (slugify, isInStock, exportCsv) export both CommonJS and ESM-compatible defaults for predictable imports." — implemented for lib/slugify.js.
- - Added pages/api/ready.js
- - New lightweight readiness endpoint that:
- - Validates presence and basic shape of data/products.json and data/attribute-groups.json
- - Returns 200 when checks pass, 503 if any check fails
- - Includes permissive CORS and short edge caching
- - Roadmap alignment:
- - Implements a near-term stability improvement: "Add health/readiness endpoints" — provides a small, deploy-friendly readiness check suitable for probes.
  - module.exports = slugify
  - module.exports.slugify = slugify
  - module.exports.default = slugify
- Purpose: Ensure codebase files that both default-import and require slugify work reliably (addresses import/export compatibility and the roadmap item to provide predictable utility exports).

## Next Steps

- - Audit other utility modules for consistent export shapes (suggested priority):
- 1) lib/products.js
- 2) lib/isInStock.js (already provides default but confirm named export)
- 3) lib/exportCsv.js (already includes shims; verify consumers)
- - Add unit tests for slugify (tests/slugify.test.js) covering:
- - Accented characters, punctuation, whitespace collapse, underscores, numbers, empty/null/undefined input.
- - Update README with short developer guidance on importing utilities across CommonJS and ESM.
- - Optionally add a CI lint/test that verifies key utilities expose both default and named exports.
- - Audit other utility modules for consistent export shapes (priority):
- 1. lib/products.js
- 2. lib/isInStock.js (already provides default but confirm named export)
- 3. lib/exportCsv.js (already includes shims; verify consumers)
- - Add unit tests for slugify (tests/slugify.test.js) covering:
- - Accented characters, punctuation, whitespace collapse, underscores, numbers, empty/null/undefined input.
- - Update README or developer docs with guidance about importing utilities in CommonJS vs ESM contexts.
- - Optionally add a CI lint/test that verifies critical utilities expose both default and named exports to prevent regressions.
- - Add monitoring/alerting probes to call /api/ready in production (e.g., uptime checks).
- - Extend readiness checks to verify optional services (databases, caches) when integrated.
- - Add unit tests for the readiness endpoint (tests/api-ready.test.js) to cover success and failure scenarios.
- - Consider consolidating similar health endpoints (health, health-check, healthz-check, ready) into a small health API hub to avoid duplication and keep responses consistent.
