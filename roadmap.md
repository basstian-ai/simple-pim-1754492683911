# Roadmap

## Progress

- +  - Replaced/updated slugify implementation with robust Unicode normalization, diacritic stripping, and safe character collapsing.
- +  - Added compatibility exports: module.exports, module.exports.default, exports.slugify to ensure both CommonJS and common ESM import-default patterns work.
- +  - Exposed a small _impl diagnostic object for tests/debugging.
- +
- +
- - Implemented robust slugifier and improved module interop (lib/slugify.js)
- - Unicode NFKD normalization + diacritic removal
- - Lowercase, safe character collapsing to hyphens, optional maxLength support
- - Exports: module.exports, module.exports.default, module.exports.slugify, and __esModule flag for broad compatibility
- - Added small _impl helpers for debugging
- - Roadmap item implemented: "Improved lib/slugify.js" (Unicode-safe slugifier, export compatibility)
- - Improved lib/slugify.js:
- - Replaced former simplistic slugifier with a Unicode-aware implementation using NFKD normalization and safe stripping of combining marks.
- - Collapses non-alphanumerics to hyphens, lowercases, trims, and supports optional maxLength.
- - Exposed multiple export shapes for compatibility: module.exports (function), module.exports.default, module.exports.slugify, exports.slugify, and __esModule = true.
- - Added small _impl.toAscii helper for diagnostics.
- - No other files modified.
- - Fixed malformed/corrupted pages/api/health-lite.js by replacing its content with a clean, consistent health endpoint implementation:
- - Ensures permissive CORS for probes, supports OPTIONS preflight, returns 200 JSON for GET with uptime and optional package version, sets short edge caching headers, and returns 405 for unsupported methods.
- - No other files modified.
  - Replaced the placeholder implementation with a robust slugifier that removes diacritics via Unicode normalization.
  - Trimmed leading and trailing hyphens, added optional max-length support, and exported multiple shapes for CommonJS/ES module interop.
  - Added a small `_impl` diagnostics object for debugging.

## Next Steps

- [ ] Create user interface components for creating, editing, and deleting products directly in the dashboard.
- [ ] Add intuitive navigation with a sidebar and breadcrumb trail to improve orientation.
- [ ] Implement role-based access control for admin functionality.
- [ ] Surface inventory metrics and recent activity in dashboard widgets.
- +- Run full test suite (npm test) in CI to ensure other modules using slugify behave as expected.
- +- Audit other small helper modules to ensure consistent CommonJS/ESM interop (e.g., functions that are sometimes required and sometimes imported as default).
- +- Consider adding a small unit test for slugify edge-cases (accents, long strings, trimming) to guard regressions.
- - Run full test suite: npm test (CI) to catch any remaining import/interop issues across modules.
- - Add unit tests specifically for slugify edge cases (accents, long strings, punctuation).
- - Audit other internal helper modules for consistent CommonJS/ESM export patterns (e.g., lib/exportCsv, lib/variants) and add similar compatibility shims where needed.
- - If desired, extend slugify with transliteration tables for non-Latin scripts (currently relies on Unicode normalization only).
- - Run full test suite (npm test) in CI to ensure all modules depending on slugify behave as expected.
- - If tests reveal regressions, adjust callers that relied on previous slug behavior (e.g., stricter code generation) or add adapter wrappers where necessary.
- - Add unit tests specifically for slugify edge-cases: accented characters, long strings with maxLength, non-Latin input, and empty/invalid input.
- - Audit other internal helper modules for consistent CommonJS/ESM interop and add similar compatibility shims (e.g., lib/exportCsv already has shims; search for modules missing them).
- - Consider adding transliteration for non-Latin scripts if broader multilingual slug support is required (e.g., use small transliteration maps without adding heavy deps).
- - Run full CI test suite (npm test) to confirm no other route files contain accidental corruption.
- - Add a small unit test for /api/health-lite (e.g., tests/api-health-lite.test.js) to guard against regressions.
- - Audit other API route files for accidental merge artifacts or malformed content and fix as needed.
- - Consider centralizing health endpoints behavior to a shared helper to keep consistency across /api/health*, /api/ready, /api/status.
