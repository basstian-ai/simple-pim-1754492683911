// Robust slugify utility
// - Performs Unicode NFKD normalization and strips diacritics
// - Falls back gracefully for non-string inputs
// - Collapses non-alphanumeric sequences to single hyphens
// - Trims leading/trailing hyphens
// - Optional maxLength via options: { maxLength: 100 }
// Exported in multiple shapes for CommonJS / ESM interop:
//   const slugify = require('./slugify')
//   import slugify from './slugify'
// Consumers may also reference .default / .slugify

function toAscii(input) {
  if (input == null) return '';
  // Ensure string
  let s = String(input);
  // Normalize to NFKD to separate diacritics, then remove combining marks
  try {
    s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  } catch (_) {
    // If normalize unsupported or fails, continue with original string
    s = s;
  }
  return s;
}

function slugify(input, opts) {
  const options = opts || {};
  const maxLength = typeof options.maxLength === 'number' && options.maxLength > 0 ? options.maxLength : null;

  if (input == null) return '';
  let s = toAscii(input);
  // Lowercase, replace non-alphanumeric groups with hyphen
  s = s.toLowerCase();
  // Replace any non a-z0-9 characters with hyphen. Keep unicode letters already stripped to ascii.
  s = s.replace(/[^a-z0-9]+/g, '-');
  // Collapse multiple hyphens
  s = s.replace(/-+/g, '-');
  // Trim
  s = s.replace(/(^-|-$)/g, '');
  if (maxLength && s.length > maxLength) {
    s = s.slice(0, maxLength);
    // avoid trailing hyphen after cut
    s = s.replace(/(^-|-$)/g, '');
  }
  return s;
}

// Attach some helpers for diagnostics / tests
slugify._impl = { toAscii };

// CommonJS exports
module.exports = slugify;
module.exports.default = slugify;
module.exports.slugify = slugify;
module.exports.__esModule = true;
// Named export fallback (some require styles)
exports.slugify = slugify;

// Keep a friendly toString for debugging
slugify.toString = function () { return '[function slugify]'; };

// default export shim for consumers using default import
export default slugify;
