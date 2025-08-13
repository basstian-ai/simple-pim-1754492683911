# Roadmap

## Progress

- - No other files modified.
- - lib/slugify.js
- - Replaced prior implementation with a robust, dependency-free slugifier.
- - Adds Unicode NFKD normalization + combining mark stripping to remove diacritics.
- - Adds small transliteration mapping for common ligatures (æ, œ, ß, ø, etc.).
- - Collapses non-alphanumerics to single hyphens, trims, and supports maxLength option.
- - Exports for broad compatibility:
- - module.exports = slugify (CommonJS function)
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
  - Replaced the placeholder implementation with a robust slugifier that removes diacritics via Unicode normalization.
  - Trimmed leading and trailing hyphens, added optional max-length support, and exported multiple shapes for CommonJS/ES module interop.
  - Added a small `_impl` diagnostics object for debugging.

## Next Steps

- - Run full test suite in CI (npm test) to catch any other API shape mismatches.
- - Audit other API routes for inconsistent response shapes (e.g., some return { data }, others return raw arrays) and standardize where helpful.
- - Consider documenting API response shapes (data vs groups) in README or an OpenAPI spec for clearer client expectations.
- - If desired, add deprecation notices for older shapes and migrate callers to a single canonical response format over time.
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
