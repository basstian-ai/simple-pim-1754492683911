# Project Roadmap — PIM Platform

This repository implements a lightweight Product Information Management (PIM) platform focused on ease-of-use, a modern UI, and strong APIs. The file below outlines short-term priorities and a practical plan to improve stability, developer experience, and feature completeness.

Status: lightweight roadmap for the next milestones (early-stage).

## Goals (high level)
- Provide reliable, documented developer APIs for products, attributes and exports.
- Improve UX for common workflows: attribute modeling, bulk tagging, variant generation.
- Keep the platform simple and self-contained (no external dependencies required for core features).

## Near-term milestones 

1) Stabilize API surface and error handling
   - Audit API routes for consistent JSON responses and CORS where appropriate.
   - Ensure timeouts and safe error wrappers are applied (protect serverless functions).
   - Add small integration tests for critical endpoints (health, products list, attribute groups).

2) Improve developer ergonomics
   - Add a lightweight roadmap.md (this file).
   - Add small helper wrappers (withTimeout, withErrorHandling) around read-heavy endpoints — already present in lib/.
   - Ensure common utilities (slugify, isInStock, exportCsv) export both CommonJS and ESM-compatible defaults for predictable imports.

3) UX improvements for admin pages
   - Add copy/export affordances for sample products and CSV export links.
   - Make admin attribute editors resilient to missing data.

## Mid-term milestones 
- Add an "Import / Export" mini-workflow to seed/restore attribute groups (local or file upload).
- Add lightweight telemetry for admins (counts, last-updated timestamps).
- Implement role-aware actions and confirmation flows for destructive ops (delete group, remove attribute).

## Longer-term 
- Integrate optional external enrichment (AI assisted suggestions) behind feature flags and env variables.
- Add background jobs for large exports and async processing.
- Multi-tenant improvements, RBAC, and audit logs.


— Project maintainer


## Progress

- - lib/slugify.js
- - Replaced previous implementation with a robust Unicode-aware slugify function.
- - Added interoperability exports:
- - module.exports = slugify (CommonJS default)
- - module.exports.slugify = slugify (named)
- - module.exports.default = slugify (.default for ESM interop)
- - exports.slugify = slugify
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
  - module.exports = slugify
  - module.exports.slugify = slugify
  - module.exports.default = slugify
- Purpose: Ensure codebase files that both default-import and require slugify work reliably (addresses import/export compatibility and the roadmap item to provide predictable utility exports).

## Next Steps

- - Add unit tests for slugify (tests/slugify.test.js) covering:
- - Accented characters, punctuation, whitespace collapse, empty/null input.
- - Add a short developer note in README about preferred import patterns for utilities (CommonJS vs ESM interop).
- - Optionally add a CI lint/test to detect ambiguous/missing default exports on key utility modules.
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
