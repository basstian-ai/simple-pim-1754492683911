/**
 * Robust slugify utility (CommonJS)
 *
 * - Normalizes Unicode (NFKD) and strips diacritics
 * - Replaces non-alphanumeric runs with a single hyphen
 * - Trims leading/trailing hyphens
 * - Lowercases the result
 *
 * Export shape:
 *  - module.exports = slugify
 *  - module.exports.slugify = slugify
 *  - module.exports.default = slugify
 *  - exports.slugify = slugify
 *
 * This ensures compatibility when files import via `require()` or `import slugify from '...';`
 */
function slugify(input) {
  if (input === null || input === undefined) return '';
  const s = String(input);

  // Normalize (decompose) Unicode to separate accents, then remove diacritic marks.
  // NFKD is a good balance for transliteration of accents.
  let normalized = s.normalize ? s.normalize('NFKD') : s;
  // Remove combining diacritical marks
  normalized = normalized.replace(/[\u0300-\u036f]/g, '');

  // Replace any non-alphanumeric characters with hyphens.
  // Allow ASCII a-z and 0-9. Collapse multiple non-alnum into a single hyphen.
  const slug = normalized
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  return slug;
}

// CommonJS default export
module.exports = slugify;
// Named export for require()/destructuring or ESM consumers using interop
module.exports.slugify = slugify;
// Provide a `default` property to help ESM default-import interop in various bundlers
module.exports.default = slugify;
// Also set on exports object
exports.slugify = slugify;
// Small metadata for debugging
module.exports._impl = { name: 'slugify', normalized: true };

// default export shim for consumers using default import
export default slugify;
