/* Lightweight, robust slugify utility
 *
 * Goals:
 * - Remove diacritics when possible (String.prototype.normalize).
 * - Lowercase, trim and collapse non-alphanumeric runs into single dashes.
 * - Be defensive about inputs and expose multiple module shapes so callers
 *   using require() or import default/named work reliably.
 *
 * Keep this file as CommonJS (module.exports) to match the rest of the codebase.
 */

function removeDiacritics(input) {
  if (!input) return '';
  const s = String(input);
  if (typeof s.normalize === 'function') {
    // NFKD separates base characters from diacritics; remove combining marks.
    return s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  }
  // Minimal fallback replacements for common accented characters.
  return s
    .replace(/[ÀÁÂÃÄÅàáâãäå]/g, 'a')
    .replace(/[ÈÉÊËèéêë]/g, 'e')
    .replace(/[ÌÍÎÏìíîï]/g, 'i')
    .replace(/[ÒÓÔÕÖØòóôõöø]/g, 'o')
    .replace(/[ÙÚÛÜùúûü]/g, 'u')
    .replace(/[Çç]/g, 'c')
    .replace(/[Ññ]/g, 'n')
    .replace(/[^A-Za-z0-9\s-]/g, '');
}

function slugify(input) {
  if (input == null) return '';
  let s = String(input).trim();
  if (!s) return '';

  // Remove diacritics (best-effort)
  s = removeDiacritics(s);

  // Heuristic replacements for better readability
  s = s.replace(/&/g, '-and-');

  // Lowercase and collapse unwanted characters to single dash
  s = s.toLowerCase();
  s = s.replace(/[^a-z0-9]+/g, '-'); // anything not alnum -> dash
  s = s.replace(/(^-+|-+$)/g, '');   // trim leading/trailing dashes
  s = s.replace(/-{2,}/g, '-');      // collapse repeated dashes

  return s;
}

// CommonJS / ESM interop shims:
// - module.exports = slugify (works for require and many default-import scenarios)
// - module.exports.default = slugify (helps import * as mod; mod.default)
// - module.exports.slugify = slugify (named import compatibility)
module.exports = slugify;
module.exports.default = slugify;
module.exports.slugify = slugify;
exports.slugify = slugify;

// Small implementation details exposed for testing/debugging (non-critical)
module.exports._impl = { removeDiacritics };

// End of file

// default export shim for consumers using default import
export default slugify;
