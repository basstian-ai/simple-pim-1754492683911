'use strict';

/**
 * Robust slugify utility that:
 * - Normalizes Unicode (removes diacritics)
 * - Lowercases input
 * - Replaces runs of non-alphanumeric characters with single hyphen
 * - Trims leading/trailing hyphens
 *
 * Export shape is CommonJS-first but also provides common interop shims so
 * both `require('../lib/slugify')` and `import slugify from '../lib/slugify'`
 * work reliably in mixed codebases.
 */
function slugify(input) {
  if (input == null) return '';
  const s = String(input);
  // Normalize Unicode to separate diacritics, then remove combining marks.
  // This keeps the implementation dependency-free while handling accented letters.
  let normalized = s.normalize ? s.normalize('NFKD') : s;
  normalized = normalized.replace(/[\u0300-\u036f]/g, '');

  const out = normalized
    .toLowerCase()
    .trim()
    // replace any run of non-alphanumeric characters with a single hyphen
    .replace(/[^a-z0-9]+/g, '-')
    // trim leading/trailing hyphens
    .replace(/^-+|-+$/g, '');

  return out;
}

// CommonJS default export
module.exports = slugify;
// Named export (CommonJS)
module.exports.slugify = slugify;
module.exports.default = slugify;
// Also set on exports if present
if (typeof exports !== 'undefined') {
  exports.slugify = slugify;
}

// Minimal metadata for debugging (non-essential)
module.exports._impl = { name: 'slugify', version: '1.0.0' };

// default export shim for consumers using default import
export default slugify;
