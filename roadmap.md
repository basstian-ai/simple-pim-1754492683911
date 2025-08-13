# Roadmap

## Progress

- - pages/api/tags.js
- - Improved robustness:
- - Sets Content-Type and permissive CORS headers.
- - Handles OPTIONS preflight with 204 response.
- - Enforces allowed methods (GET, OPTIONS) and returns 405 for others.
- - Adds short edge caching header (s-maxage=60, stale-while-revalidate=300).
- - Accepts both `search` and `q` query parameter names.
- - Wraps logic in try/catch and logs server-side errors while returning a safe 500 JSON error to clients.
- - lib/slugify.js
- - Replaced legacy/basic slugifier with a robust implementation:
- - Unicode NFKD normalization and diacritic stripping
- - Small transliteration map (æ, œ, ß, ø, ñ, etc.)
- - Collapses non-alphanumerics to hyphens and trims edges
- - Optional maxLength truncation
- - Added compatibility exports:
- - module.exports = slugify
- - module.exports.slugify, module.exports.default
- - exports.slugify, exports.default for ESM-style imports
- - module.exports._impl exposing toAscii and DEFAULT_MAX_LENGTH for diagnostics/tests
- - Implemented to reduce interop errors where callers default-import lib/slugify but the module previously exported only named or differing shapes.
  - Replaced the placeholder implementation with a robust slugifier that removes diacritics via Unicode normalization.
  - Trimmed leading and trailing hyphens, added optional max-length support, and exported multiple shapes for CommonJS/ES module interop.
  - Added a small `_impl` diagnostics object for debugging.

## Next Steps

- - Add unit tests for slugify edge-cases (accents, long truncation, non-Latin input, null/undefined) in tests/slugify.test.js.
- - If wider international transliteration is required (e.g., Cyrillic, Greek, CJK), consider a lightweight optional transliteration layer or document current behavior.
- - Audit other utility modules for CommonJS/ESM interop and add compatibility shims where necessary (pattern used here can be reused).
- - Run full CI (npm test) to exercise all modules that rely on slugify and catch any edge regressions.
- - Add unit tests for slugify edge-cases (tests/slugify.test.js): accented input, ligatures, very long strings (truncation), non-Latin input behavior, null/undefined inputs.
- - Consider adding optional transliteration for non-Latin scripts (Cyrillic/Greek) if broader international slug support is required — keep it as an opt-in enhancement to avoid adding heavy dependencies.
- - Audit other utility modules for CJS/ESM interop consistency; apply the same export shim pattern where appropriate (e.g., lib/variants, lib/isInStock) if tests surface interop issues.
- - Run full CI (npm test) to exercise all modules that rely on slugify and catch any regressions.
- - Add unit tests for slugify edge-cases (accents, ligatures, very long input, null/undefined) under tests/slugify.test.js.
- - Audit other utility modules for CJS/ESM interop and add similar shims if tests reveal mismatches.
- - If broader transliteration (Cyrillic/Greek/CJK) is required, consider an optional transliteration layer or document current behavior to set expectations.
- - Run full test suite (npm test) in CI to ensure integration tests pass after header and behavior changes.
- - Consider standardizing API response shapes across endpoints (some return arrays, others { data: ... }) and update clients accordingly.
- - Add lightweight documentation for API caching and CORS behavior in README or API docs.
- - If necessary, add similar CORS/error/caching patterns to other public read endpoints for consistency (e.g., /api/tags/stats, /api/attributes).
- - Run the full test suite (npm test) in CI to validate no regressions across modules that rely on slugify.
- - Add unit tests covering slugify edge cases:
- - Accented characters, ligatures, very long inputs (truncation), empty/null/undefined inputs, non-Latin scripts expectations.
- - If broader transliteration is required (Cyrillic/Greek/CJK), evaluate lightweight opt-in transliteration libraries or document current behavior for consumers.
- - Audit other utility modules for CJS/ESM interop and add similar compatibility shims if tests reveal mismatches.
