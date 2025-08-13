# Roadmap

## Progress

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
- +- Fixed/Improved lib/slugify.js:
- +  - Replaced previous implementation with a robust, dependency-free slugifier (Unicode normalization, diacritics removal, small transliteration map, hyphen collapsing, truncation).
- +  - Exported common shapes for CJS/ESM interop:
- +    - module.exports.slugify
- +    - module.exports.default
- +    - module.exports.toAscii and module.exports._impl for diagnostics
- +  - Files that import slugify (default imports) will now reliably receive the function.
- +- No other files changed.
- +
- +
  - Replaced the placeholder implementation with a robust slugifier that removes diacritics via Unicode normalization.
  - Trimmed leading and trailing hyphens, added optional max-length support, and exported multiple shapes for CommonJS/ES module interop.
  - Added a small `_impl` diagnostics object for debugging.

## Next Steps

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
- +- Run full test suite (npm test) in CI to catch any modules depending on slugify edge behavior.
- +- Add unit tests for slugify edge cases (accented chars, ligatures, long truncation, non-Latin input) under tests/slugify.test.js.
- +- Optionally expand transliteration map for additional languages (Cyrillic/Greek) or provide opt-in transliteration if broader international coverage is needed.
- +- Audit other utility modules for CJS/ESM interop and add similar compatibility shims where appropriate (pattern used here can be reused).
