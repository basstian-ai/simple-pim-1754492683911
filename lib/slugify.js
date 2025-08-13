/* eslint-disable max-params */
// Robust, dependency-free slugify utility.
// - Removes diacritics using Unicode normalization (NFKD) and strips combining marks
// - Small transliteration map for common ligatures (æ, œ, ß, ø, etc.)
// - Collapses non-alphanumerics to hyphens, trims edges, lowercases
// - Optional maxLength truncation
//
// Export shape:
//   module.exports = slugify
//   module.exports.slugify = slugify
//   module.exports.default = slugify
// so both `require('../lib/slugify')` and `import slugify from '../lib/slugify'`
// work consistently across the codebase.

function _toAscii(input) {
  if (!input && input !== 0) return '';
  let s = String(input);
  // Basic transliteration for a few common ligatures/characters.
  // Keep small to avoid large tables; expand as needed.
  const translit = {
    'œ': 'oe',
    'Œ': 'oe',
    'æ': 'ae',
    'Æ': 'ae',
    'ß': 'ss',
    'ø': 'o',
    'Ø': 'o',
    'å': 'a',
    'Å': 'a',
    'ñ': 'n',
    'Ñ': 'n',
    'ç': 'c',
    'Ç': 'c',
    'ğ': 'g',
    'Ğ': 'g',
  };

  try {
    // Normalize to decompose accents (NFKD). Best-effort: if env doesn't support,
    // fall back to original string.
    s = s.normalize ? s.normalize('NFKD') : s;
  } catch (_) {
    // ignore
  }

  // Replace small set of ligatures / special chars
  s = s.replace(/[œŒæÆßøØåÅñÑçÇğĞ]/g, (ch) => translit[ch] || '');

  // Remove common combining diacritical marks (covers most accents)
  s = s.replace(/[\u0300-\u036f]/g, '');

  return s;
}

function slugify(input, maxLength = 80) {
  if (input == null) return '';
  let s = _toAscii(String(input));

  // Replace anything that is not alphanumeric with a hyphen.
  // We intentionally allow ASCII-only chars here to keep slugs compact.
  s = s.replace(/[^A-Za-z0-9]+/g, '-');

  // Collapse multiple hyphens
  s = s.replace(/-+/g, '-');

  // Trim leading/trailing hyphens
  s = s.replace(/(^-+|-+$)/g, '');

  s = s.toLowerCase();

  if (typeof maxLength === 'number' && isFinite(maxLength) && maxLength > 0) {
    if (s.length > maxLength) {
      s = s.slice(0, maxLength);
      // If truncation leaves a trailing hyphen, trim it.
      s = s.replace(/(^-+|-+$)/g, '');
    }
  }

  return s;
}

// Compatibility exports (CommonJS + ESM interop)
module.exports = slugify;
module.exports.slugify = slugify;
module.exports.toAscii = _toAscii;
module.exports.default = slugify;
module.exports._impl = { toAscii: _toAscii, slugify };

// default export shim for consumers using default import
export default slugify;
