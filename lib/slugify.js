// Robust slugify utility
// - Uses Unicode NFKD normalization to strip diacritics
// - Applies a small transliteration map for common ligatures
// - Collapses non-alphanumeric runs to a single hyphen
// - Trims leading/trailing hyphens and optional length truncation
// Exports:
//  - CommonJS: module.exports = slugify
//  - Named properties: module.exports.slugify, module.exports.default
//  - _impl for debugging/tests

/* eslint-disable no-param-reassign */
function toAscii(input) {
  if (input == null) return '';
  let s = String(input);
  // Normalize to NFKD to separate diacritics
  try {
    s = s.normalize('NFKD');
  } catch (_) {
    // ignore if normalize not available
  }

  // Remove combining diacritical marks
  s = s.replace(/[\u0300-\u036f]/g, '');

  // Small transliteration map for common ligatures and special letters
  const map = {
    'æ': 'ae',
    'œ': 'oe',
    'ß': 'ss',
    'ø': 'o',
    'ñ': 'n',
    'ł': 'l',
    'đ': 'd',
    'ð': 'd',
    'þ': 'th',
    'ă': 'a',
    'ș': 's',
    'ț': 't',
  };
  s = s.replace(/[ÆŒßøñłđðþășț]/g, (ch) => {
    const lower = ch.toLowerCase();
    return map[lower] || lower;
  });

  return s;
}

function slugify(value, maxLength = 200) {
  if (value == null) return '';
  const ascii = toAscii(value);
  // Replace any sequence of non-alphanumeric characters with hyphen
  let slug = ascii
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  if (typeof maxLength === 'number' && maxLength > 0 && slug.length > maxLength) {
    // Truncate without cutting a multi-byte char (string safe in JS) and avoid trailing hyphen
    slug = slug.slice(0, maxLength).replace(/(^-|-$)+/g, '');
  }
  return slug;
}

// Compatibility exports for varied import styles across the codebase.
// Many modules use `import slugify from '../lib/slugify'` (ESM default import)
// while other parts use CommonJS require(). To be robust we attach the
// function to module.exports as default and named properties.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = slugify;
  module.exports.slugify = slugify;
  module.exports.default = slugify;
  module.exports._impl = { toAscii, DEFAULT_MAX_LENGTH: 200 };
}

// Also provide a named export for environments that import this file as ESM.
try {
  // eslint-disable-next-line no-undef
  if (typeof exports !== 'undefined') {
    exports.slugify = slugify;
    exports.default = slugify;
  }
} catch (_) {}

/* end of lib/slugify.js */

// default export shim for consumers using default import
export default slugify;
