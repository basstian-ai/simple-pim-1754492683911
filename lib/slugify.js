/**
 * Robust slugify utility.
 *
 * - Normalizes Unicode (NFKD) and strips combining diacritics.
 * - Replaces any run of non-alphanumeric characters with single hyphens.
 * - Trims leading/trailing hyphens and collapses repeated hyphens.
 * - Returns lowercase slugs. Empty input => empty string.
 *
 * Export shape:
 * - CommonJS default: module.exports = slugify
 * - Named: module.exports.slugify = slugify
 * - ESM interop: module.exports.default = slugify
 * - Also attaches exports.slugify for some bundlers that prefer named exports.
 */
function removeDiacritics(str) {
  // Use Unicode normalization to decompose accented characters then remove
  // combining marks. This is widely supported in modern Node.js runtimes.
  try {
    return String(str).normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  } catch (e) {
    // Fallback: best-effort replacement for common accents when normalize not available
    return String(str)
      .replace(/[ÀÁÂÃÄÅàáâãäåĀā]/g, 'a')
      .replace(/[ÈÉÊËèéêëĒē]/g, 'e')
      .replace(/[ÌÍÎÏìíîïĪī]/g, 'i')
      .replace(/[ÒÓÔÕÖØòóôõöøŌō]/g, 'o')
      .replace(/[ÙÚÛÜùúûüŪū]/g, 'u')
      .replace(/[Ýýÿ]/g, 'y')
      .replace(/[Çç]/g, 'c')
      .replace(/[Ññ]/g, 'n');
  }
}

function slugify(input) {
  if (input === null || typeof input === 'undefined') return '';
  const s = String(input);
  if (!s) return '';

  // remove diacritics first, then replace anything non-alphanumeric with hyphens
  const noDiacritics = removeDiacritics(s);

  // Replace groups of non-alphanumeric characters with a single hyphen.
  // Keep ASCII letters and numbers. Underscores and spaces also become hyphens.
  const replaced = noDiacritics
    .replace(/[^A-Za-z0-9]+/g, '-')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');

  return replaced;
}

// Interop exports for CommonJS and ESM consumers (helps when callers use both import styles)
module.exports = slugify;
module.exports.slugify = slugify;
module.exports.default = slugify;
exports.slugify = slugify;

// expose a tiny _impl surface for debugging/tests if needed
module.exports._impl = {
  removeDiacritics,
};

/* Example:
   const slugify = require('./lib/slugify');
   // or (ESM-like) import slugify from './lib/slugify';
   console.log(slugify('Café Crème — 250g')); // => cafe-creme-250g
 */

// default export shim for consumers using default import
export default slugify;
