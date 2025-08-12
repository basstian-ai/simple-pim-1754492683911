// Robust slugify utility with compatibility exports.
// Ensures both CommonJS (require) and ESModule-style default imports work.
// Usage:
//   const slugify = require('./lib/slugify');
//   import slugify from './lib/slugify';
//
// The implementation:
//  - normalizes unicode (removes accents)
//  - lowercases
//  - replaces non-alphanumeric runs with a single hyphen
//  - trims leading/trailing hyphens
//  - limits result to reasonable length
/* eslint-disable no-param-reassign */
'use strict';

function slugify(value, opts) {
  const s = String(value == null ? '' : value);
  const maxLen = (opts && opts.maxLength) || 240;

  // Normalize unicode and remove diacritics (e.g. é -> e)
  let out = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

  // Replace any non-alphanumeric sequence with a hyphen
  out = out
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  if (out.length > maxLen) out = out.slice(0, maxLen).replace(/-+$/g, '');

  return out;
}

// CommonJS default export
module.exports = slugify;
// Named export for environments using `require('./lib/slugify').slugify`
module.exports.slugify = slugify;
// ESModule interop: allow `import slugify from './lib/slugify'`
module.exports.default = slugify;

// Also attach to exports object in case some bundlers access exports directly
try {
  if (typeof exports === 'object' && typeof exports !== 'undefined') {
    exports.default = slugify;
    exports.slugify = slugify;
  }
} catch (e) {
  // ignore
}

/* end of slugify.js */

// default export shim for consumers using default import
export default slugify;
