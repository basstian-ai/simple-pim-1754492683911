# Roadmap

## Progress

- - Collapses non-alphanumerics to hyphens, trims, optional maxLength
- - Exposes multiple export shapes: module.exports, module.exports.default, module.exports.slugify, and ESM named/default exports
- - Adds slugify._impl.toAscii helper for diagnostics/tests
- - Reason: Many modules in the codebase import slugify via different module styles (default import vs require). This change ensures callers receive a working default function and improves slug correctness for international input.
- - Fixed CommonJS/ESM interoperability and improved international slug handling:
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
  - Replaced the placeholder implementation with a robust slugifier that removes diacritics via Unicode normalization.
  - Trimmed leading and trailing hyphens, added optional max-length support, and exported multiple shapes for CommonJS/ES module interop.
  - Added a small `_impl` diagnostics object for debugging.

## Next Steps

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
- - Add unit tests for slugify edge-cases: accented input, long truncation, non-Latin input, empty/null values.
- - Run full CI test suite (npm test) to ensure no import/interop regressions across all modules.
- - Audit other helper modules for similar CommonJS/ESM interop issues (e.g., lib/variants, lib/exportCsv already has shims).
- - Optionally add lightweight transliteration for non-Latin scripts if broader multilingual slug support is required (avoid heavy deps).
- - If any callers expected the previous slug behavior, adjust them or add adapter wrappers to preserve backward compatibility.
- - Run full test suite in CI (npm test) to catch any other API shape mismatches.
- - Audit other API routes for inconsistent response shapes (e.g., some return { data }, others return raw arrays) and standardize where helpful.
- - Consider documenting API response shapes (data vs groups) in README or an OpenAPI spec for clearer client expectations.
- - If desired, add deprecation notices for older shapes and migrate callers to a single canonical response format over time.
