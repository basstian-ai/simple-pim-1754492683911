'use strict';

/**
 * Robust slugify utility
 *
 * - Normalizes Unicode (NFKD) and strips diacritics
 * - Lowercases, collapses non-alphanumerics to single hyphens
 * - Trims leading/trailing hyphens
 *
 * Exports:
 *  - CommonJS default (module.exports = slugify)
 *  - Named: .slugify
 *  - ESM interop: .default
 *  - Internals under ._impl for testing/debugging
 */

function removeDiacritics(str) {
  try {
    // Normalize to decompose combined characters, then strip diacritic marks
    return String(str || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  } catch (e) {
    // If normalize isn't available (very old envs), fall back to original string
    return String(str || '');
  }
}

function slugify(input) {
  if (input == null) return '';
  let s = String(input);
  s = removeDiacritics(s);
  s = s.toLowerCase();
  // Replace any sequence of non-alphanumeric characters with a single hyphen
  s = s.replace(/[^a-z0-9]+/g, '-');
  // Trim leading/trailing hyphens
  s = s.replace(/(^-+)|(-+$)/g, '');
  return s;
}

// CommonJS default export
module.exports = slugify;
// Named export
module.exports.slugify = slugify;
// ESM interop
module.exports.default = slugify;
// Expose internals for debugging/tests (non-critical)
module.exports._impl = { removeDiacritics };

// Also support ES module named export when transpiled/imported as ESM
exports.slugify = slugify;
exports.default = slugify;

// default export shim for consumers using default import
export default slugify;
