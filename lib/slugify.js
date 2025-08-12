// Robust slugify utility (CommonJS) with ESM interop shims.
// Produces URL-friendly slugs from arbitrary strings, handling Unicode
// diacritics, punctuation, and repeated separators.
// Export shape:
//   module.exports = slugify
//   module.exports.slugify = slugify
//   module.exports.default = slugify
//   exports.slugify = slugify
// This makes the function safe to require(...) and import default from ES modules.

function removeDiacritics(str) {
  // Use Unicode normalization to decompose accented characters and strip them.
  // Falls back gracefully when normalize isn't available.
  try {
    return String(str).normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  } catch (_e) {
    // Very old JS environments may not support normalize; fallback to original string.
    return String(str);
  }
}

function slugify(value) {
  if (value === null || value === undefined) return '';
  let s = String(value);

  // Trim and remove control characters
  s = s.trim().replace(/[\r\n\t]+/g, ' ');

  // Remove diacritics (é -> e)
  s = removeDiacritics(s);

  // Convert to lower-case
  s = s.toLowerCase();

  // Replace any non-alphanumeric runs with a single hyphen.
  // Keep ASCII letters and numbers. Also allow unicode letters by using \p{L} if supported,
  // but to keep compatibility we allow a broad set via negation of common safe chars.
  s = s.replace(/[^a-z0-9]+/g, '-');

  // Collapse multiple hyphens and trim leading/trailing hyphens
  s = s.replace(/-+/g, '-').replace(/(^-|-$)/g, '');

  return s;
}

// Export CommonJS default and named for interop
module.exports = slugify;
module.exports.slugify = slugify;
module.exports.default = slugify;
module.exports._impl = { removeDiacritics };
exports.slugify = slugify;
exports.default = slugify;

/* Usage:
   const slugify = require('../lib/slugify');
   // or (ESM / transpiled)
   import slugify from '../lib/slugify';
*/

// default export shim for consumers using default import
export default slugify;
