// Robust slugify utility
// - Removes diacritics (when String.prototype.normalize is available)
// - Lowercases, trims, replaces non-alphanumeric runs with single hyphens
// - Collapses repeated hyphens and trims leading/trailing hyphens
// - Exposes multiple CommonJS/ESM-compatible export shapes:
//   module.exports = slugify
//   module.exports.slugify = slugify
//   module.exports.default = slugify
//   exports.slugify = slugify
//
// This helps callers that use require(...) or `import slugify from '...'` interop.

function removeDiacritics(str) {
  if (!str) return str;
  // Use normalization when available to strip accents/diacritics
  if (typeof String.prototype.normalize === 'function') {
    return str.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  }
  // Fallback: rough transliteration for common chars
  return str
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõöø]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    .replace(/[ß]/g, 'ss');
}

function slugify(input, opts) {
  const s = input == null ? '' : String(input);
  const maxLen = (opts && typeof opts.maxLength === 'number') ? opts.maxLength : 200;

  // Normalize & remove diacritics
  let out = removeDiacritics(s);

  // Lowercase, trim
  out = out.toLowerCase().trim();

  // Replace any non-alphanumeric (a-z0-9) sequences with hyphen.
  // Keep unicode letters by first removing diacritics; remaining extended letters will be stripped.
  out = out.replace(/[^a-z0-9]+/g, '-');

  // Collapse multiple hyphens
  out = out.replace(/-+/g, '-');

  // Trim leading/trailing hyphens
  out = out.replace(/(^-|-$)/g, '');

  if (maxLen && out.length > maxLen) out = out.slice(0, maxLen).replace(/(^-|-$)/g, '');

  return out;
}

// Expose multiple shapes for interoperability between require/import styles.
// Primary CommonJS export:
module.exports = slugify;

// Named export on the CommonJS object:
module.exports.slugify = slugify;

// Default property for interoperability with some bundlers/transpilers:
module.exports.default = slugify;

// Also attach to exports for environments that use `exports` object.
try {
  exports.slugify = slugify;
} catch (_) {}

// Expose a small impl surface for tests/debugging (non-critical)
module.exports._impl = { removeDiacritics };
module.exports._version = '1';

/* Example usages this file is defensive about:
   const slugify = require('../lib/slugify'); // -> function
   import slugify from '../lib/slugify'; // -> function (default)
   const { slugify: s } = require('../lib/slugify'); // -> named
*/

// EOF

