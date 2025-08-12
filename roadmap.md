# Roadmap

## Progress

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
- - Fixed CommonJS/ESM interop for slugify and provided a robust Unicode-aware implementation:
- - Modified: lib/slugify.js
- - Implements NFKD normalization and diacritic stripping (_toAscii)
- - Collapses non-alphanumerics to hyphens, trims, optional maxLength
- - Exposes multiple export shapes: module.exports, module.exports.default, module.exports.slugify, and ESM named/default exports
- - Adds slugify._impl.toAscii helper for diagnostics/tests
- - Reason: Many modules in the codebase import slugify via different module styles (default import vs require). This change ensures callers receive a working default function and improves slug correctness for international input.
  - Replaced the placeholder implementation with a robust slugifier that removes diacritics via Unicode normalization.
  - Trimmed leading and trailing hyphens, added optional max-length support, and exported multiple shapes for CommonJS/ES module interop.
  - Added a small `_impl` diagnostics object for debugging.

## Next Steps

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
- - Run full CI test suite (npm test) and fix any callers that relied on previous slug output edge-cases.
- - Add unit tests for slugify edge-cases:
- - accented characters, long truncation, non-Latin inputs, empty input.
- - Audit other internal helper modules for CommonJS/ESM interop mismatches and add compatibility shims similar to lib/slugify.js where appropriate (e.g., lib/variants, lib/exportCsv already includes shims).
- - Consider adding lightweight transliteration for non-Latin scripts if broader international slug support is required (without introducing heavy dependencies).
