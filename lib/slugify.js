/* Robust slugify utility
 *
 * - Removes diacritics via Unicode NFKD normalization and combining-mark stripping
 * - Applies a small transliteration map for common ligatures (æ, œ, ß, ø, etc.)
 * - Collapses non-alphanumeric sequences to single hyphens
 * - Trims leading/trailing hyphens
 * - Optionally accepts { maxLength } to truncate the result safely
 *
 * Export shape:
 *  - CommonJS: module.exports = slugify
 *  - Additional shims: module.exports.default, module.exports.slugify, exports.slugify
 *  - module.exports._impl exposes helpers for tests/diagnostics
 */

const DEFAULT_MAX_LENGTH = 200;

function toAscii(input) {
  if (!input && input !== 0) return '';
  const s = String(input);

  // Quick map for common ligatures / special cases
  const ligatureMap = {
    '\u00E6': 'ae', // æ
    '\u00C6': 'AE',
    '\u0153': 'oe', // œ
    '\u0152': 'OE',
    '\u00DF': 'ss', // ß
    '\u00F8': 'o',  // ø
    '\u00D8': 'O',
    '\u00E5': 'a',  // å
    '\u0142': 'l',  // ł
    '\u0131': 'i',  // dotless i
  };

  let out = s.replace(/[\u00C0-\u017F]/g, (ch) => ligatureMap[ch] || ch);

  // Normalize to NFKD and strip combining marks (diacritics)
  out = out.normalize ? out.normalize('NFKD') : out;
  // Remove combining diacritical marks
  out = out.replace(/[\u0300-\u036f]/g, '');

  return out;
}

function slugify(value, options = {}) {
  if (value === null || value === undefined) return '';
  const { maxLength = DEFAULT_MAX_LENGTH } = options || {};

  // Convert to ASCII-ish form
  let s = toAscii(value);

  // Lowercase
  s = s.toLowerCase();

  // Replace any sequence of non-alphanumeric characters with a single hyphen
  // Allow a-z, 0-9 and keep hyphens as separator
  s = s.replace(/[^a-z0-9]+/g, '-');

  // Trim leading/trailing hyphens
  s = s.replace(/^-+|-+$/g, '');

  if (typeof maxLength === 'number' && maxLength > 0 && s.length > maxLength) {
    // Truncate cleanly: cut to maxLength then trim trailing hyphen if present
    s = s.slice(0, maxLength).replace(/-+$/g, '');
  }

  return s;
}

// Exports (CommonJS + compatibility shims for ESM default / named imports)
module.exports = slugify;
module.exports.default = slugify;
module.exports.slugify = slugify;
exports.slugify = slugify;

// Expose internals for diagnostics/testing (non-critical)
module.exports._impl = {
  toAscii,
  DEFAULT_MAX_LENGTH,
};

// mark as ES module interop flag
try {
  Object.defineProperty(module.exports, '__esModule', { value: true });
} catch (_) {}

// default export shim for consumers using default import
export default slugify;
