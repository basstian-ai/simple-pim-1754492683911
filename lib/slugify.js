/**
 * Robust slugify utility (CommonJS)
 *
 * - Normalizes Unicode (NFKD) and strips diacritics
 * - Replaces non-alphanumeric runs with a single hyphen
 * - Trims leading/trailing hyphens
 * - Lowercases result
 * - Limits length to reasonable size
 *
 * Exports:
 *  - module.exports = slugify (default)
 *  - module.exports.slugify = slugify (named)
 *  - module.exports.default = slugify (interop)
 *  - exports.slugify = slugify
 */

function slugify(input, opts) {
  if (input == null) return '';
  const s = String(input);
  const { maxLength = 80 } = opts || {};

  // Normalize unicode to separate diacritics, then remove diacritics.
  // NFKD is chosen to separate accent marks into combining characters.
  let str = s.normalize ? s.normalize('NFKD') : s;
  // Remove combining diacritical marks
  str = str.replace(/[\u0300-\u036f]/g, '');

  // Replace non-alphanumeric (including underscores) with hyphen
  str = str.replace(/[^A-Za-z0-9]+/g, '-');

  // Collapse multiple hyphens
  str = str.replace(/-+/g, '-');

  // Trim hyphens
  str = str.replace(/(^-|-$)/g, '');

  // Lowercase
  str = str.toLowerCase();

  if (maxLength && typeof maxLength === 'number') {
    if (str.length > maxLength) str = str.slice(0, maxLength);
    // trim trailing hyphen that may be created by slicing
    str = str.replace(/(^-|-$)/g, '');
  }

  return str;
}

// Export patterns to be compatible with both require() and ESM default imports.
module.exports = slugify;
module.exports.slugify = slugify;
module.exports.default = slugify;
exports.slugify = slugify;
module.exports._impl = { algo: 'unicode-nfkd-strip, replace-non-alnum-by-hyphen', maxDefaultLength: 80 };

// default export shim for consumers using default import
export default slugify;
