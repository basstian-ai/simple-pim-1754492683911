/**
 * Robust slugify utility
 *
 * Exports:
 *  - CommonJS default: module.exports = slugify
 *  - Named: module.exports.slugify = slugify
 *  - ESM interop: module.exports.default = slugify
 *  - Also attaches a small _impl object for debugging/tests.
 *
 * Behavior:
 *  - Accepts strings (and other values via String(value))
 *  - Normalizes Unicode (NFKD) and strips diacritics
 *  - Replaces runs of non-alphanumeric characters with single hyphen
 *  - Trims leading/trailing hyphens
 *  - Lowercases output
 *
 * This file intentionally uses CommonJS exports for compatibility with the
 * rest of the codebase which mixes require() and import statements.
 */

function removeDiacritics(str) {
  // Normalize to NFKD and remove combining marks. Safe and widely supported.
  // If normalize isn't supported in an environment, fallback to original string.
  try {
    return str.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  } catch (_) {
    return str;
  }
}

function slugify(value) {
  if (value === null || value === undefined) return '';
  // Convert to string early to accept numbers and other primitives
  let s = String(value);
  s = removeDiacritics(s);
  // Lowercase for consistent slugs
  s = s.toLowerCase();
  // Replace any group of non-alphanumeric characters with a single hyphen
  // Allow ASCII letters and numbers; treat underscores, spaces and punctuation as separators.
  s = s.replace(/[^a-z0-9]+/g, '-');
  // Trim leading/trailing hyphens
  s = s.replace(/^-+|-+$/g, '');
  return s;
}

// Provide interoperability shims so both require() and import default work.
module.exports = slugify;
module.exports.slugify = slugify;
module.exports.default = slugify;
exports.slugify = slugify;
module.exports._impl = { removeDiacritics };

// default export shim for consumers using default import
export default slugify;
