/* Lightweight, robust slugify utility
 *
 * Goals:
 * - Remove diacritics using Unicode normalization when available
 * - Lowercase, trim and collapse non-alphanumeric sequences into hyphens
 * - Trim leading/trailing hyphens and optionally enforce a max length
 * - Export both default and named shapes to be friendly for CommonJS/ES interop
 *
 * Consumers in this repo import slugify in various ways:
 *  - import slugify from '../lib/slugify'
 *  - const slugify = require('../lib/slugify')
 *  - const { slugify } = require('../lib/slugify')
 *
 * To make all styles work reliably, we export the function as:
 *  - module.exports = slugify
 *  - module.exports.slugify = slugify
 *  - module.exports.default = slugify
 *  - exports.slugify = slugify
 */

function removeDiacritics(str) {
  if (typeof str !== 'string') return '';
  // Use Unicode normalization to decompose characters, then strip combining marks.
  // If normalize isn't available, fall back to a conservative replacement table.
  if (typeof String.prototype.normalize === 'function') {
    return str.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  }

  // Fallback minimal map for common characters (keeps bundle small)
  const map = {
    // Latin-1 Supplement common accents
    À: 'A', Á: 'A', Â: 'A', Ã: 'A', Ä: 'A', Å: 'A', à: 'a', á: 'a', â: 'a', ã: 'a', ä: 'a', å: 'a',
    Ç: 'C', ç: 'c',
    È: 'E', É: 'E', Ê: 'E', Ë: 'E', è: 'e', é: 'e', ê: 'e', ë: 'e',
    Ì: 'I', Í: 'I', Î: 'I', Ï: 'I', ì: 'i', í: 'i', î: 'i', ï: 'i',
    Ò: 'O', Ó: 'O', Ô: 'O', Õ: 'O', Ö: 'O', ò: 'o', ó: 'o', ô: 'o', õ: 'o', ö: 'o',
    Ù: 'U', Ú: 'U', Û: 'U', Ü: 'U', ù: 'u', ú: 'u', û: 'u', ü: 'u',
    Ñ: 'N', ñ: 'n',
    ß: 'ss',
  };
  return str.replace(/[^\u0000-\u007E]/g, function (a) { return map[a] || a; });
}

function collapseToHyphen(s) {
  // Replace any sequence of non-alphanumeric characters with a single hyphen.
  // Keep ASCII letters and numbers; convert underscores and whitespace to hyphens too.
  return s.replace(/[^a-z0-9]+/g, '-');
}

/**
 * slugify(value, options)
 * options:
 *  - maxLength: optional positive integer to trim resulting slug
 */
function slugify(input, options) {
  try {
    const opts = options || {};
    const maxLength = Number.isInteger(opts.maxLength) && opts.maxLength > 0 ? opts.maxLength : null;

    let s = String(input == null ? '' : input);
    s = s.trim();
    if (s.length === 0) return '';

    // Normalize and remove diacritics
    s = removeDiacritics(s);

    // Lowercase
    s = s.toLowerCase();

    // Collapse to hyphens
    s = collapseToHyphen(s);

    // Trim leading/trailing hyphens
    s = s.replace(/^-+|-+$/g, '');

    // Enforce max length without cutting mid-word awkwardly:
    if (maxLength && s.length > maxLength) {
      // Try to cut at last hyphen before maxLength
      const cut = s.lastIndexOf('-', maxLength);
      if (cut > 0) s = s.slice(0, cut);
      else s = s.slice(0, maxLength);
      // Trim any trailing hyphens after cut
      s = s.replace(/^-+|-+$/g, '');
    }

    return s;
  } catch (err) {
    // On unexpected errors return a minimal fallback (avoid throwing from utility)
    try {
      if (input == null) return '';
      return String(input).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 240);
    } catch (_) {
      return '';
    }
  }
}

// Attach a small diagnostics object for debugging & tests
slugify._impl = {
  removeDiacritics,
  collapseToHyphen,
};

// CommonJS + interop friendly exports
module.exports = slugify;
module.exports.slugify = slugify;
module.exports.default = slugify;
exports.slugify = slugify;

// Also expose a small version string for tooling that inspects utilities
module.exports._version = '1';

// default export shim for consumers using default import
export default slugify;
