/**
 * Robust slugify utility compatible with both CommonJS and modern bundlers.
 *
 * - Removes diacritics using Unicode NFKD normalization.
 * - Replaces non-alphanumeric runs with a single hyphen.
 * - Trims leading/trailing hyphens.
 * - Produces lower-case ASCII-friendly slugs.
 *
 * This module exports the function as the module.exports value (CommonJS),
 * and also assigns `.slugify` and `.default` properties for compatibility
 * with various import styles used across the codebase.
 */
function slugify(input) {
  if (input === null || input === undefined) return '';
  const s = String(input);

  // Normalize to NFKD and strip diacritics (accents)
  // If normalize is not available in the environment, fall back gracefully.
  let normalized = s;
  try {
    normalized = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  } catch (_) {
    // no-op: leave normalized as original string
    normalized = s;
  }

  const slug = normalized
    .toLowerCase()
    .trim()
    // replace any sequence of non-alphanum characters with a single hyphen
    .replace(/[^a-z0-9]+/g, '-')
    // remove leading/trailing hyphens
    .replace(/(^-|-$)+/g, '');

  return slug;
}

// CommonJS export (primary). Consumers doing `const slugify = require('./slugify')`
// will get the function directly.
module.exports = slugify;

// Provide named and default properties on the exported function/object so that:
// - `const { slugify } = require('./slugify')` works
// - `import slugify from './slugify'` works with common bundlers & interop
module.exports.slugify = slugify;
module.exports.default = slugify;
module.exports._impl = { slugify };


try {
  exports.slugify = slugify; // eslint-disable-line no-undef
} catch (_) {}

// default export shim for consumers using default import
export default slugify;
