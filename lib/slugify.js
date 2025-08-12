/**
 * Lightweight, dependency-free slugify utility.
 *
 * Behavior:
 * - Converts input to string
 * - Normalizes Unicode (NFKD) and strips diacritics
 * - Lowercases, trims
 * - Replaces any sequence of non-alphanumeric characters with a single hyphen
 * - Trims leading/trailing hyphens
 *
 * Export style:
 * - CommonJS: module.exports = slugify
 * - Also exposes .slugify and .default for compatibility
 *
 * This implementation is intentionally simple and deterministic so that it's
 * safe to use in both server-side and client-side code paths.
 */
function slugify(input) {
  if (input === null || input === undefined) return '';
  let s = String(input);

  // Normalize and strip diacritics where possible
  try {
    s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  } catch (_) {
    // Older environments may not support normalize; ignore and continue
  }

  s = s
    .toLowerCase()
    .trim()
    // Replace anything that's not a-z0-9 with a hyphen
    .replace(/[^a-z0-9]+/g, '-')
    // Collapse multiple hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/(^-+)|(-+$)/g, '');

  return s;
}

// CommonJS exports (works for require and for many bundlers / transpilers that map default imports)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = slugify;
  module.exports.slugify = slugify;
  module.exports.default = slugify;
}

// Nothing else — keep file CommonJS-only to maximize compatibility with existing codebase.

// default export shim for consumers using default import
export default slugify;
