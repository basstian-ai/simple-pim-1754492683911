


## Progress

- - Implements a near-term stability improvement: "Add health/readiness endpoints" — provides a small, deploy-friendly readiness check suitable for probes.
- - Fixed corrupted pages/api/ready.js and implemented a robust readiness endpoint.
- - File: pages/api/ready.js
- - Behavior:
- - Responds to GET with honest readiness status and per-check diagnostics for products and attribute groups data files.
- - Returns 200 when checks pass, 503 when any check fails.
- - Supports OPTIONS preflight and includes permissive CORS and short edge cache headers.
- - Best-effort package.json version included in response.
- - This implements roadmap item: "Add health/readiness endpoints" and provides a deploy-friendly readiness check.
- - Ensured robust slugify utility with Unicode diacritics removal and stable slug generation (lib/slugify.js)
- - Exposes CommonJS default (module.exports), named export (.slugify), and .default shim for ESM interop
- - Adds internal helper removeDiacritics via module.exports._impl for testing/debugging
- - Implemented export shape compatibility to reduce import errors when codebase mixes require() and import default syntax
- - Added pages/api/health-hub.js
- - New consolidated health + readiness endpoint that:
- - Returns process metadata (uptime, package version, commit)
- - Performs lightweight checks for data/products.json and data/attribute-groups.json
- - Returns 200 when both checks pass, 503 when any check fails
- - Exposes permissive CORS and short edge caching for probes
  - module.exports = slugify
  - module.exports.slugify = slugify
  - module.exports.default = slugify
- Purpose: Ensure codebase files that both default-import and require slugify work reliably (addresses import/export compatibility and the roadmap item to provide predictable utility exports).

## Next Steps

- - Consider consolidating similar health endpoints (health, health-check, healthz-check, ready) into a small health API hub to avoid duplication and keep responses consistent.
- - Add unit tests for the readiness endpoint (success + missing data scenarios).
- - Add monitoring/uptime probe to call /api/ready in production (e.g., UptimeRobot, Pingdom).
- - Consider consolidating similar health endpoints (health, health-check, healthz, ready) into a single health API hub to avoid duplication.
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
