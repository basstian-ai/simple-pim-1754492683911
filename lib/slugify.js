/**
 * Robust slugify utility
 *
 * - Normalizes Unicode (NFKD) and strips diacritics
 * - Lowercases, trims
 * - Replaces runs of non-alphanumeric characters with a single hyphen
 * - Trims leading/trailing hyphens
 *
 * Export shape:
 * - CommonJS default: module.exports = slugify
 * - Named: module.exports.slugify
 * - ESM interop: module.exports.default
 *
 * This shape makes the helper usable whether a consumer does:
 *   const slugify = require('./lib/slugify');
 * or
 *   import slugify from '../lib/slugify';
 */
function slugify(input) {
  if (input === null || input === undefined) return '';
  let s = String(input);

  // Normalize unicode to decompose accents, then remove combining marks.
  // Example: "Café" -> "Cafe"
  try {
    s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  } catch (_) {
    // normalize may not be available in some very constrained environments;
    // fall back to original string if normalization fails.
  }

  s = s.toLowerCase().trim();
  // Replace any run of non-alphanumeric characters with a hyphen
  s = s.replace(/[^a-z0-9]+/g, '-');
  // Collapse multiple hyphens and trim
  s = s.replace(/(^-+|-+$)/g, '');

  return s;
}

// CommonJS exports + interop shims
module.exports = slugify;
module.exports.slugify = slugify;
module.exports.default = slugify;
exports.slugify = slugify;
module.exports._impl = { slugifyInternal: slugify };

// default export shim for consumers using default import
export default slugify;
