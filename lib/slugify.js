'use strict';

// Lightweight, dependency-free slugifier with CJS/ESM compatibility shims.
// - Unicode-normalizes and strips combining diacritics
// - Applies a small transliteration map for common Latin ligatures
// - Replaces non-alphanumeric sequences with a single hyphen
// - Trims leading/trailing hyphens and collapses repeated hyphens
// - Exposes multiple shapes for interoperability: module.exports = fn, .default, .slugify, .toAscii, ._impl

function toAscii(input) {
  if (input == null) return '';
  let s = String(input);

  // Normalize to decompose combined letters (NFKD preferred for compatibility)
  try {
    if (s.normalize) s = s.normalize('NFKD');
  } catch (e) {
    // ignore if normalization not supported
  }

  // Basic transliteration map for a few common ligatures/letters where normalization
  // does not produce desirable ascii representation
  const trans = {
    // Latin ligatures and special letters
    'ß': 'ss',
    'Æ': 'AE', 'æ': 'ae',
    'Œ': 'OE', 'œ': 'oe',
    'Ø': 'O',  'ø': 'o',
    'Å': 'A',  'å': 'a',
    'Ł': 'L',  'ł': 'l',
    'Đ': 'D',  'đ': 'd',
    'Ñ': 'N',  'ñ': 'n',
    'Ç': 'C',  'ç': 'c'
  };

  // Replace characters present in transliteration map; leave others for diacritic stripping below
  s = s.replace(/[^A-Za-z0-9\u0300-\u036f\s\-_.]+/g, function (ch) {
    return Object.prototype.hasOwnProperty.call(trans, ch) ? trans[ch] : ch;
  });

  // Remove combining diacritical marks left after normalization
  s = s.replace(/[\u0300-\u036f]/g, '');

  return s;
}

function slugify(input, opts) {
  const options = Object.assign({ lower: true, maxLength: 100 }, opts || {});
  if (input == null) return '';

  let s = toAscii(input);

  // Replace underscores with spaces to normalize before collapsing to hyphens
  s = s.replace(/[_]+/g, ' ');

  // Replace any sequence of non-alphanumeric characters with a single hyphen
  s = s.replace(/[^A-Za-z0-9]+/g, '-');

  // Trim leading/trailing hyphens
  s = s.replace(/(^-+|-+$)/g, '');

  if (options.maxLength && typeof options.maxLength === 'number') {
    if (s.length > options.maxLength) s = s.slice(0, options.maxLength);
    // Trim any trailing hyphen after truncation
    s = s.replace(/-+$/g, '');
  }

  if (options.lower) s = s.toLowerCase();

  return s;
}

// Attach helpers and provide multiple export shapes for CommonJS <-> ESM interop
module.exports = slugify;
module.exports.default = slugify; // allow `import slugify from '.../lib/slugify'` in ESM
module.exports.slugify = slugify; // named export
module.exports.toAscii = toAscii; // low-level utility exposed for tests/debug
module.exports._impl = {
  toAscii,
  transliterationMap: {
    'ß': 'ss', 'æ': 'ae', 'Æ': 'AE', 'œ': 'oe', 'Œ': 'OE',
    'ø': 'o', 'Ø': 'O', 'å': 'a', 'Å': 'A', 'ł': 'l',
    'Ł': 'L', 'đ': 'd', 'Đ': 'D', 'ñ': 'n', 'Ñ': 'N', 'ç': 'c', 'Ç': 'C'
  }
};

// For environments that support named exports via require interop
try {
  if (typeof exports === 'object') exports.slugify = slugify;
} catch (_) {}

// End of lib/slugify.js

// default export shim for consumers using default import
export default slugify;
