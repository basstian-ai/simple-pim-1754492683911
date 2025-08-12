// Lightweight slugify utility
// - Produces URL-friendly slugs from arbitrary strings
// - Removes diacritics, lowercases, trims, collapses non-alphanumerics to '-'
// - Exports as CommonJS (module.exports) and provides a default export property
//   so both `require('./slugify')` and `import slugify from './slugify'` work reliably.

function slugify(input) {
  if (input == null) return '';
  // Convert to string and normalize unicode (separate diacritics), then remove them.
  // This makes "Café" => "Cafe" reliably on Node versions that support .normalize().
  let s = String(input);
  try {
    s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  } catch (_) {
    // If normalize isn't available for some reason, continue with original string.
  }
  return s
    .toLowerCase()
    .trim()
    // Replace any sequence of non-alphanumeric characters with a single hyphen
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/(^-|-$)+/g, '');
}

// CommonJS export (primary)
module.exports = slugify;
// Named export for environments that require it
module.exports.slugify = slugify;
// Ensure default interop for `import slugify from '...';` consumers
module.exports.default = slugify;

// Also expose a shallow ESM-compatible named export when possible (used by bundlers)
try {
  // eslint-disable-next-line no-undef
  if (typeof exports === 'object') {
    exports.slugify = slugify;
  }
} catch (_) {}

/* EOF */

// default export shim for consumers using default import
export default slugify;
