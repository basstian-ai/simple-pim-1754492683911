/* Lightweight, robust slugify utility.
 * - Unicode normalizes input and strips diacritics
 * - Replaces non-alphanumeric runs with single hyphens
 * - Trims leading/trailing hyphens and collapses repeated hyphens
 * - Returns lowercase slugs and enforces a reasonable max length
 *
 * Export shape:
 *  - CommonJS default: module.exports = slugify
 *  - Named on CommonJS object: module.exports.slugify
 *  - ESM-compatible default (interop): module.exports.default
 *
 * This keeps imports like:
 *   const slugify = require('../lib/slugify');
 *   import slugify from '../lib/slugify';
 *   const { slugify } = require('../lib/slugify');
 *
 * all working in the codebase.
 */
'use strict';

function slugify(input) {
  if (input == null) return '';
  let s = String(input);

  // Unicode normalize to separate accents, then strip combining marks.
  // NFKD is broadly supported and works well for diacritic removal.
  try {
    if (typeof s.normalize === 'function') s = s.normalize('NFKD');
  } catch (_) {}
  s = s.replace(/[\u0300-\u036f]/g, '');

  // Lowercase and trim whitespace
  s = s.toLowerCase().trim();

  // Replace runs of non-alphanumeric characters with a single hyphen
  s = s.replace(/[^a-z0-9]+/g, '-');

  // Collapse repeated hyphens and trim edge hyphens
  s = s.replace(/-+/g, '-').replace(/(^-|-$)+/g, '');

  // Limit length for stability and strip trailing hyphen after truncation
  const MAX_LEN = 80;
  if (s.length > MAX_LEN) s = s.slice(0, MAX_LEN).replace(/-+$/g, '');

  return s;
}

// CommonJS export (default) + named + interop helpers
module.exports = slugify;
module.exports.slugify = slugify;
module.exports.default = slugify;
module.exports._impl = { name: 'slugify', version: 1 };

/* EOF */

// default export shim for consumers using default import
export default slugify;
