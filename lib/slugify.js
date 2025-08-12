/* Lightweight, dependency-free slugifier
 *
 * Goals:
 * - Robust Unicode normalization (remove diacritics via NFKD)
 * - Produce stable, URL-friendly slugs: lowercased, hyphen-separated
 * - Provide exports compatible with CommonJS require() and ESM default imports
 *
 * Consumers in this codebase use both `require('../lib/slugify')` and
 * `import slugify from '../lib/slugify'`. To be resilient we export the
 * function as module.exports, module.exports.default and a named export.
 */

function _normalizeUnicode(str) {
  try {
    // NFKD separates base chars + diacritics; remove combining marks
    return String(str || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  } catch (err) {
    // Fallback if normalize isn't supported
    return String(str || '');
  }
}

function slugify(input, opts) {
  opts = opts || {};
  if (input == null) return '';
  let s = String(input);

  // Normalize & strip diacritics
  s = _normalizeUnicode(s);

  // Lowercase, trim
  s = s.toLowerCase().trim();

  // Replace any sequence of non-alphanumeric characters with a single hyphen.
  // Keep a-z and 0-9 only to maximize compatibility in URLs and filenames.
  s = s.replace(/[^a-z0-9]+/g, '-');

  // Collapse repeated hyphens and trim edge hyphens
  s = s.replace(/-+/g, '-').replace(/(^-|-$)/g, '');

  // Optional max length (don't break in the middle of a multi-byte sequence),
  // we simply slice the string which is safe for JS strings (UTF-16), but keep
  // a short post-trim to avoid trailing hyphen.
  if (opts && typeof opts.maxLength === 'number' && opts.maxLength > 0) {
    if (s.length > opts.maxLength) {
      s = s.slice(0, opts.maxLength).replace(/-$/g, '');
    }
  }

  return s;
}

// CommonJS default
module.exports = slugify;

// Named export compatibility and ESM default shape
module.exports.slugify = slugify;
module.exports.default = slugify;

// Small debug helpers
module.exports._impl = {
  normalizeUnicode: _normalizeUnicode,
};

// If running in a transpiled ESM environment that uses `export default`, some
// bundlers/readers check for `exports.__esModule`. Setting this flag helps
// interop in a few edge cases.
try {
  Object.defineProperty(module.exports, '__esModule', { value: true });
} catch (_) {}

// End of file

