/* Lightweight, safe slugify utility
 *
 * - Intentionally CommonJS-first for compatibility with existing code that
 *   uses require().
 * - Also exposes named properties (slugify and default) on module.exports so
 *   both `const slugify = require('./lib/slugify')` and
 *   `import slugify from './lib/slugify'` work under typical bundlers.
 *
 * Behavior:
 *  - trims input
 *  - strips common diacritics (using Unicode NFD when available)
 *  - lowercases
 *  - replaces non-alphanumeric sequences with '-'
 *  - collapses repeated '-' and trims edges
 */

function stripDiacritics(str) {
  try {
    return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  } catch (e) {
    // Fallback for very old runtimes
    return String(str).replace(/[ÀÁÂÃÄÅàáâãäåĀāÈÉÊËèéêëĒēÍÎÏìíîïĪīÒÓÔÕÖØòóôõöøŌōÙÚÛÜùúûüŸÿÑñÇç]/g, '');
  }
}

function slugify(input) {
  if (input == null) return '';
  const raw = String(input).trim();
  if (!raw) return '';

  let s = stripDiacritics(raw);
  s = s.toLowerCase();
  s = s.replace(/[^a-z0-9]+/g, '-');
  s = s.replace(/-+/g, '-');
  s = s.replace(/(^-|-$)/g, '');
  return s;
}

// Primary CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = slugify;
  // Provide common interop shapes used across the codebase
  module.exports.slugify = slugify;
  module.exports.default = slugify;
}

// Also expose as a named export for environments that import the module
// using transpiled/ESM-aware tooling (keeps static analysis friendly).
try {
  if (typeof exports !== 'undefined') {
    exports.slugify = slugify;
  }
} catch (_) {}

/* End of lib/slugify.js */

// default export shim for consumers using default import
export default slugify;
