# Roadmap

## Progress

- - module.exports.default = slugify (ESM default)
- - module.exports.slugify and exports.slugify (named)
- - module.exports._impl exposes toAscii and DEFAULT_MAX_LENGTH for tests/diagnostics
- - Ensures __esModule flag is present to help interop.
- - lib/slugify.js
- - Replaced previous simple placeholder with a robust slugifier:
- - Unicode NFKD normalization + combining mark stripping to remove diacritics
- - Small transliteration map for common ligatures (æ, œ, ß, ø, etc.)
- - Collapses non-alphanumerics to hyphens, trims edges, optional maxLength
- - Exports compatible shapes for CommonJS and ESM consumers:
- - module.exports (function), module.exports.default, module.exports.slugify, exports.slugify
- - Exposes _impl { toAscii, DEFAULT_MAX_LENGTH } for tests/diagnostics
- - pages/api/tags.js
- - Improved robustness:
- - Sets Content-Type and permissive CORS headers.
- - Handles OPTIONS preflight with 204 response.
- - Enforces allowed methods (GET, OPTIONS) and returns 405 for others.
- - Adds short edge caching header (s-maxage=60, stale-while-revalidate=300).
- - Accepts both `search` and `q` query parameter names.
- - Wraps logic in try/catch and logs server-side errors while returning a safe 500 JSON error to clients.
  - Replaced the placeholder implementation with a robust slugifier that removes diacritics via Unicode normalization.
  - Trimmed leading and trailing hyphens, added optional max-length support, and exported multiple shapes for CommonJS/ES module interop.
  - Added a small `_impl` diagnostics object for debugging.

## Next Steps

- - Run the full test suite: npm test — this change touches a widely-imported helper; run tests to ensure no regressions.
- - Audit modules that manipulate slugs or rely on previous slug edge-cases; adjust them if stricter ASCII transliteration changes behavior (rare).
- - Optionally add unit tests for slugify edge-cases (accents, long truncation, non-string inputs, empty values) to tests/slugify.test.js.
- - Consider lightweight transliteration for non-Latin scripts if broader internationalization is required (without adding heavy dependencies).
- - Run full test suite: npm test — this change touches a widely-used helper; run CI to catch any regressions.
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
