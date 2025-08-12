/**
 * Robust slugify utility
 *
 * - Removes diacritics using Unicode normalization when available
 * - Lowercases and trims input
 * - Replaces any non-alphanumeric sequence with a single hyphen
 * - Trims leading/trailing hyphens and optionally enforces max length
 *
 * Export shapes:
 *  - CommonJS: module.exports = slugify
 *  - Named: exports.slugify = slugify
  *  - Default property for interop: module.exports.default = slugify
  *
 * This defensive export shape helps both require() and ES-style imports across
 * different modules in the codebase without changing the module system.
 */

function _removeDiacritics(str) {
  if (!str) return str;
  // Normalize to NFKD and remove combining marks (diacritics)
  if (typeof String.prototype.normalize === 'function') {
    return str.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  }
  return str;
}

function slugify(input, opts = {}) {
  if (input == null) return '';
  const { maxLength = 240 } = opts;
  let s = String(input);
  s = _removeDiacritics(s);
  s = s.toLowerCase().trim();
  // Replace any sequence of non-alphanumeric characters with a single hyphen
  s = s.replace(/[^a-z0-9]+/g, '-');
  // Trim leading/trailing hyphens
  s = s.replace(/(^-+|-+$)/g, '');
  if (maxLength && typeof maxLength === 'number' && maxLength > 0) {
    if (s.length > maxLength) s = s.slice(0, maxLength);
    // avoid cutting trailing hyphen from slice
    s = s.replace(/(^-+|-+$)/g, '');
  }
  return s;
}

// Friendly helpers for debugging / testing
slugify._impl = {
  removeDiacritics: _removeDiacritics,
  normalize: typeof String.prototype.normalize === 'function',
  version: '1.0.0',
};

// Export in multiple shapes for interoperability across CJS/ES import styles.
// Consumers may do:
//  - const slugify = require('./lib/slugify');
//  - import slugify from '../lib/slugify';
//  - const { slugify } = require('./lib/slugify');
module.exports = slugify;
module.exports.slugify = slugify;
module.exports.default = slugify;
exports.slugify = slugify;

// default export shim for consumers using default import
export default slugify;
