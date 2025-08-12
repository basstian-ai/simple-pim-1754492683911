/*
 * Robust slugify utility used across the app.
 * - Removes diacritics using Unicode normalization
 * - Lowercases, trims, converts non-alphanumerics to hyphens
 * - Collapses multiple separators and trims leading/trailing hyphens
 *
 * Exports:
 * - CommonJS: module.exports = slugify
 * - Named property: module.exports.slugify
 * - Default shim: module.exports.default = slugify
 * - Internals for testing/debugging: module.exports._impl
 */

function removeDiacritics(str) {
  if (typeof str !== 'string') return '';
  // Use NFKD normalization and strip combining diacritical marks
  try {
    return str.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  } catch (e) {
    // Older environments may not support normalize; fallback to a simple map
    return str
      .replace(/[ÀÁÂÃÄÅàáâãäåĀā]/g, 'a')
      .replace(/[ÇçČč]/g, 'c')
      .replace(/[Ðð]/g, 'd')
      .replace(/[ÈÉÊËèéêëĒē]/g, 'e')
      .replace(/[ĠĝĞğ]/g, 'g')
      .replace(/[ÌÍÎÏìíîïĪī]/g, 'i')
      .replace(/[Łł]/g, 'l')
      .replace(/[ÑñńŃ]/g, 'n')
      .replace(/[ÒÓÔÕÖØòóôõöøŌō]/g, 'o')
      .replace(/[ŔŕŘř]/g, 'r')
      .replace(/[ŠšŚś]/g, 's')
      .replace(/[ÙÚÛÜùúûüŪū]/g, 'u')
      .replace(/[Ýýÿ]/g, 'y')
      .replace(/[ŽžŻż]/g, 'z');
  }
}

function slugify(input) {
  if (input == null) return '';
  const s = String(input);
  // Remove diacritics first
  const normalized = removeDiacritics(s);
  // Convert to lower-case, replace non-alphanum with hyphens, collapse repeats
  const slug = normalized
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug;
}

// CommonJS exports (also provide shims for consumers that expect named/default)
module.exports = slugify;
module.exports.slugify = slugify;
module.exports.default = slugify;
module.exports._impl = { removeDiacritics };

//# For compatibility with some bundlers that inspect `.default` on CommonJS modules
try {
  // no-op, ensures module.exports.default exists in environments that copy exports
} catch (_) {}

/* EOF */

// default export shim for consumers using default import
export default slugify;
