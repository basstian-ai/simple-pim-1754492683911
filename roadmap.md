# Roadmap

## Progress

- - Modified lib/slugify.js
- - Added Unicode normalization (NFKD) and diacritic stripping via toAscii
- - Replaced fragile regex with robust sequence: normalize -> ascii -> lowercase -> non-alnum → hyphen -> collapse -> trim
- - Added optional maxLength support via slugify(input, { maxLength: N })
- - Exported function in multiple shapes for broad compatibility:
- - module.exports = slugify
- - module.exports.default = slugify
- - module.exports.slugify = slugify
- - exports.slugify = slugify
- - module.exports.__esModule = true
- - Exposed small _impl.toAscii helper for diagnostics/tests
- - No other files modified.
- - pages/api/attribute-groups/index.js
- - Return both { data: groups, groups } for GET responses to provide compatibility for UI consumers that expect either shape.
- - Keeps cache and CORS headers intact.
- - Fixed/Improved lib/slugify.js:
- - Replaced legacy slugify with robust implementation using Unicode NFKD normalization to strip diacritics and produce cleaner ASCII slugs.
- - Collapses non-alphanumeric characters into single hyphens, trims, and supports optional maxLength.
- - Exported the function in multiple shapes for compatibility: module.exports, module.exports.default, module.exports.slugify, and exports.slugify. Added slugify._impl.toAscii helper.
- - No other files modified.
  - Replaced the placeholder implementation with a robust slugifier that removes diacritics via Unicode normalization.
  - Trimmed leading and trailing hyphens, added optional max-length support, and exported multiple shapes for CommonJS/ES module interop.
  - Added a small `_impl` diagnostics object for debugging.

## Next Steps

- - Audit other API route files for accidental merge artifacts or malformed content and fix as needed.
- - Consider centralizing health endpoints behavior to a shared helper to keep consistency across /api/health*, /api/ready, /api/status.
- - Run full CI test suite (npm test) and fix any callers that relied on previous slug output edge-cases.
- - Add unit tests for slugify edge-cases:
- - accented characters, long truncation, non-Latin inputs, empty input.
- - Audit other internal helper modules for CommonJS/ESM interop mismatches and add compatibility shims similar to lib/slugify.js where appropriate (e.g., lib/variants, lib/exportCsv already includes shims).
- - Consider adding lightweight transliteration for non-Latin scripts if broader international slug support is required (without introducing heavy dependencies).
- - Add unit tests for slugify edge-cases: accented input, long truncation, non-Latin input, empty/null values.
- - Run full CI test suite (npm test) to ensure no import/interop regressions across all modules.
- - Audit other helper modules for similar CommonJS/ESM interop issues (e.g., lib/variants, lib/exportCsv already has shims).
- - Optionally add lightweight transliteration for non-Latin scripts if broader multilingual slug support is required (avoid heavy deps).
- - If any callers expected the previous slug behavior, adjust them or add adapter wrappers to preserve backward compatibility.
- - Run full test suite in CI (npm test) to catch any other API shape mismatches.
- - Audit other API routes for inconsistent response shapes (e.g., some return { data }, others return raw arrays) and standardize where helpful.
- - Consider documenting API response shapes (data vs groups) in README or an OpenAPI spec for clearer client expectations.
- - If desired, add deprecation notices for older shapes and migrate callers to a single canonical response format over time.
- - Run the full test suite: npm test — this change touches a widely-imported helper; run tests to ensure no regressions.
- - Audit modules that manipulate slugs or rely on previous slug edge-cases; adjust them if stricter ASCII transliteration changes behavior (rare).
- - Optionally add unit tests for slugify edge-cases (accents, long truncation, non-string inputs, empty values) to tests/slugify.test.js.
- - Consider lightweight transliteration for non-Latin scripts if broader internationalization is required (without adding heavy dependencies).
