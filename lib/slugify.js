// Robust slugify utility with CommonJS + interop shims.
// - Removes diacritics (Unicode combining marks) when possible
// - Lowercases, trims, replaces non-alphanumerics with dashes
// - Collapses multiple dashes and trims edge dashes
// Exposes:
//   module.exports = slugify
//   module.exports.slugify = slugify
//   module.exports.default = slugify
// This shape makes the function usable via both require() and import default.
function slugify(input) {
  const raw = input == null ? '' : String(input);
  // Normalize to decompose accents, then remove combining marks (diacritics)
  let s = raw;
  try {
    if (typeof s.normalize === 'function') {
      // NFKD separates accents into combining marks which we can strip
      s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    }
  } catch (_) {
    // ignore normalization errors and continue with original string
  }

  // Lowercase, remove quotes, replace non-alphanumerics with dash, collapse dashes, trim
  s = s
    .toLowerCase()
    .trim()
    .replace(/['"’`]/g, '') // remove common quote characters
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumerics with dash
    .replace(/-+/g, '-') // collapse repeated dashes
    .replace(/(^-|-$)/g, ''); // trim leading/trailing dashes

  return s;
}

// CommonJS exports + interop helpers so both require() and import default work.
module.exports = slugify;
module.exports.slugify = slugify;
module.exports.default = slugify;

// Also provide a named export compatible shape when transpiled to ESM consumers expect.
exports.slugify = slugify;

/* Example:
   const slugify = require('./lib/slugify');
   // or
   import slugify from './lib/slugify';
*/


'use strict';

// The file has been replaced with a robust implementation above.
// (The initial content is no longer used; see the new slugify implementation.)

/* NOTE: This bottom section intentionally left minimal so that if a previous\n +   version appended content, there is no accidental duplication. The active\n +   implementation is exported at the top of this file. */

// default export shim for consumers using default import
export default slugify;
