/*
 * Robust slugify utility used across the project.
 *
 * Exports:
 *  - module.exports = slugify        (CommonJS default)
 *  - module.exports.slugify = slugify (named)
 *  - module.exports.default = slugify (interop for some bundlers)
 *
 * Keep this file CommonJS to maximize compatibility with the rest of the codebase
 * which mixes require(...) and ES module `import` default usage.
 */

const DEFAULT_MAX_LEN = 200;

function removeDiacritics(str) {
  // Use native normalization when available for basic accent folding.
  try {
    return str.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  } catch (_) {
    // Fallback: best-effort removal by mapping common chars.
    return str
      .replace(/[ÀÁÂÃÄÅ]/g, 'A')
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[ÈÉÊË]/g, 'E')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ÌÍÎÏ]/g, 'I')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[ÒÓÔÕÖØ]/g, 'O')
      .replace(/[òóôõöø]/g, 'o')
      .replace(/[ÙÚÛÜ]/g, 'U')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[Ç]/g, 'C')
      .replace(/[ç]/g, 'c')
      .replace(/[Ñ]/g, 'N')
      .replace(/[ñ]/g, 'n');
  }
}

function slugify(input, opts = {}) {
  const str = (input == null ? '' : String(input)).trim();
  if (str.length === 0) return '';

  const maxLen = Number.isInteger(opts.maxLength) ? opts.maxLength : DEFAULT_MAX_LEN;

  // 1) Normalize & remove accents
  let s = removeDiacritics(str);

  // 2) Lowercase
  s = s.toLowerCase();

  // 3) Replace non-alphanumeric characters with hyphens
  s = s.replace(/[^a-z0-9]+/g, '-');

  // 4) Collapse repeated hyphens and trim hyphens from ends
  s = s.replace(/-+/g, '-').replace(/(^-|-$)/g, '');

  // 5) Trim to max length and ensure we don't end with a hyphen
  if (maxLen && s.length > maxLen) {
    s = s.slice(0, maxLen);
    s = s.replace(/(^-|-$)/g, '');
  }

  return s;
}

// CommonJS exports (default + named) to be safe when imported with either
// `const slugify = require('...')` or `import slugify from '...'` or
// `const { slugify } = require('...')`.
module.exports = slugify;
module.exports.slugify = slugify;
module.exports.default = slugify;

// default export shim for consumers using default import
export default slugify;
