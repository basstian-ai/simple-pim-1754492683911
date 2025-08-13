// Robust, dependency-free slugify utility with CJS/ESM interop shims.
// - Unicode NFKD normalization + diacritic stripping
// - Small transliteration map for common ligatures
// - Collapse non-alphanumerics to single hyphens
// - Optional maxLength truncation
// - Exposes multiple shapes for import compatibility:
//     const slug = require('./lib/slugify'); // function
//     import slug from '../lib/slugify'; // works (default)
//     const { slugify } = require('./lib/slugify');
//     const { toAscii, DEFAULT_MAX_LENGTH } = require('./lib/slugify')._impl;
//
// Keep implementation intentionally small and safe for serverless environments.

'use strict';

const DEFAULT_MAX_LENGTH = 0; // 0 = no truncation

function toAscii(input) {
  if (input == null) return '';
  // Normalize and strip diacritics (NFKD form)
  let s = String(input);
  try {
    s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  } catch (_) {
    // In very old environments normalize may not exist; fall back to original string
    s = String(input);
  }

  // Small transliteration map for common ligatures / special cases
  // Keep it tiny to avoid huge tables; expand only if needed.
  const map = {
    '\u00DF': 'ss', // ß
    'Æ': 'AE',
    'æ': 'ae',
    'Œ': 'OE',
    'œ': 'oe',
    'Ø': 'O',
    'ø': 'o',
    'Þ': 'TH',
    'þ': 'th',
    'Ð': 'D',
    'ð': 'd',
  };
  s = s.replace(/[\u00DF\u00C6\u00E6\u0152\u0153\u00D8\u00F8\u00DE\u00FE\u00D0\u00F0]/g, (c) => map[c] || '');

  return s;
}

function slugify(input, maxLength = DEFAULT_MAX_LENGTH) {
  const raw = toAscii(input);
  // Convert to lower-case
  let s = raw.toLowerCase();
  // Replace any non-alphanumeric character sequence with a single hyphen
  // Accept a-z, 0-9. Collapse underscores/spaces/punctuation to hyphens.
  s = s.replace(/[^a-z0-9]+/g, '-');
  // Trim leading/trailing hyphens
  s = s.replace(/^-+|-+$/g, '');
  // Truncate if requested, try to avoid cutting mid-hyphen block
  if (maxLength && Number.isFinite(maxLength) && maxLength > 0 && s.length > maxLength) {
    s = s.slice(0, maxLength);
    // Trim dangling hyphens after truncation
    s = s.replace(/^-+|-+$/g, '');
  }
  return s;
}

// Export multiple shapes for compatibility across CommonJS and ESM import styles.
// Many files in the codebase use `import slugify from '.../lib/slugify'` (default import)
// while others may use require().exportedName. Providing these shims avoids interop issues.
module.exports = slugify;
module.exports.slugify = slugify;
module.exports.default = slugify;
module.exports._impl = { toAscii, DEFAULT_MAX_LENGTH };

// Also provide a named export when the module system supports it
exports.slugify = slugify;
exports.toAscii = toAscii;
exports.DEFAULT_MAX_LENGTH = DEFAULT_MAX_LENGTH;


/* End of lib/slugify.js */



