/* Robust slugify utility
 *
 * Goals:
 * - Remove diacritics (unicode NFKD + strip combining marks)
 * - Provide simple transliteration for a handful of common ligatures
 * - Collapse non-alphanumerics to single hyphens
 * - Trim leading/trailing hyphens and support optional max length
 * - Export as CommonJS default and named (slugify) for broad compatibility
 *
 * Note: this implementation avoids external deps and works reliably in Node
 * and Vercel serverless environments.
 */

/* eslint-disable no-useless-escape */

const DEFAULT_MAX_LENGTH = 120;

function mapSpecials(str) {
  // A small, safe mapping for common ligatures and symbols that do not
  // decompose well via Unicode normalization alone.
  return str
    .replace(/\u00DF/g, 'ss') // ß
    .replace(/\u00E6/g, 'ae') // æ
    .replace(/\u0153/g, 'oe') // œ
    .replace(/\u00F8/g, 'o')  // ø
    .replace(/\u0111/g, 'd')  // đ
    .replace(/\u0131/g, 'i')  // dotless i
    .replace(/\u2013|\u2014/g, '-') // en/em dash
    .replace(/\u2018|\u2019|\u201C|\u201D/g, '') // smart quotes
    ;
}

function toAscii(input) {
  if (input == null) return '';
  const s = String(input);
  // First apply small mapping for special characters
  let intermediate = mapSpecials(s);
  // Normalize to decompose combining marks (NFKD), then strip common combining ranges
  // Use a conservative combining mark range which covers most diacritics.
  intermediate = intermediate.normalize ? intermediate.normalize('NFKD') : intermediate;
  // Remove combining diacritical marks (U+0300 - U+036F) and other common marks
  intermediate = intermediate.replace(/[\u0300-\u036f]/g, '');
  // Remove remaining non-ASCII characters (best-effort)
  intermediate = intermediate.replace(/[^\x00-\x7F]/g, '');
  return intermediate;
}

function slugify(input, opts = {}) {
  if (input == null) return '';
  const maxLength = typeof opts === 'object' && opts.maxLength ? Number(opts.maxLength) : DEFAULT_MAX_LENGTH;

  let s = toAscii(input);
  s = s.toLowerCase().trim();

  // Replace any run of non-alphanumeric characters with a single hyphen.
  // Keep a-z, 0-9. Underscores and other punctuation are converted to hyphens.
  s = s.replace(/[^a-z0-9]+/g, '-');

  // Trim hyphens at ends
  s = s.replace(/^-+|-+$/g, '');

  if (Number.isFinite(maxLength) && maxLength > 0 && s.length > maxLength) {
    s = s.slice(0, maxLength);
    // avoid trailing hyphen after truncation
    s = s.replace(/-+$/g, '');
  }

  return s;
}

// Exports: make sure both CommonJS require(...) and ESM `import slugify from` work.
module.exports = slugify;
module.exports.default = slugify;
module.exports.slugify = slugify;
exports.slugify = slugify;
// Provide a small diagnostics/internal object for tests and debugging
module.exports._impl = { toAscii, DEFAULT_MAX_LENGTH };

// Keep top-level default export shape for environments that inspect __esModule
module.exports.__esModule = true;

// default export shim for consumers using default import
export default slugify;
