/**
 * Robust slugify utility
 *
 * Goals:
 * - Use Unicode NFKD normalization to strip diacritics (e.g. "é" -> "e")
 * - Collapse non-alphanumeric runs to single hyphens
 * - Trim leading/trailing hyphens
 * - Allow optional maxLength to truncate slugs safely
 * - Export in multiple shapes for CommonJS / ESM compatibility
 *
 * This module intentionally avoids external dependencies to remain tiny and
 * safe for serverless environments.
 */

/* eslint-disable no-param-reassign */
const DEFAULT_MAX_LENGTH = 240;

function toAscii(input) {
  if (input == null) return '';
  const s = String(input);
  // Use Unicode NFKD to decompose characters, then strip combining marks.
  // This converts many accented letters into ASCII equivalents without a heavy dependency.
  try {
    // Some older runtimes may not fully support Unicode property escapes; we use a conservative range as a fallback.
    const normalized = s.normalize && typeof s.normalize === 'function' ? s.normalize('NFKD') : s;
    // Remove combining diacritical marks (U+0300 - U+036F)
    return normalized.replace(/[\u0300-\u036f]/g, '');
  } catch (_) {
    // Best-effort fallback: strip non-ASCII chars
    return s.replace(/[^\x00-\x7F]/g, '');
  }
}

/**
 * slugify(value, [options])
 *
 * Options:
 *  - maxLength: number (optional) - truncate result to this many characters
 *
 * Returns a lowercased, hyphen-separated slug string (or empty string).
 */
function slugify(value, options) {
  const opts = options || {};
  const maxLen = typeof opts.maxLength === 'number' && opts.maxLength > 0 ? opts.maxLength : DEFAULT_MAX_LENGTH;

  if (value == null) return '';
  let s = String(value);
  s = s.trim();
  if (!s) return '';

  // Convert to ASCII-ish form and lowercase
  s = toAscii(s);
  s = s.toLowerCase();

  // Replace any run of non-alphanumeric characters with a single hyphen
  // This also collapses whitespace, punctuation, and symbols into separators.
  s = s.replace(/[^a-z0-9]+/g, '-');

  // Trim leading/trailing hyphens
  s = s.replace(/^-+|-+$/g, '');

  // Enforce max length (try not to leave a trailing hyphen)
  if (maxLen && s.length > maxLen) {
    s = s.slice(0, maxLen);
    s = s.replace(/^-+|-+$/g, '');
  }

  return s;
}

// Export shapes for broad compatibility
module.exports = slugify;
module.exports.default = slugify;
module.exports.slugify = slugify;
exports.slugify = slugify;
module.exports.__esModule = true;

// Export internals for diagnostics / tests (non-essential)
module.exports._impl = {
  toAscii,
  DEFAULT_MAX_LENGTH,
};

/* EOF */

// default export shim for consumers using default import
export default slugify;
