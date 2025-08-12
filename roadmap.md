# Roadmap

## Progress

- Improved `lib/slugify.js`:
- +- lib/slugify.js
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
  - Replaced the placeholder implementation with a robust slugifier that removes diacritics via Unicode normalization.
  - Trimmed leading and trailing hyphens, added optional max-length support, and exported multiple shapes for CommonJS/ES module interop.
  - Added a small `_impl` diagnostics object for debugging.

## Next Steps

- [ ] Design and implement an admin dashboard to manage products and categories.
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
