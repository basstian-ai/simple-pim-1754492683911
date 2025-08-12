// Robust slugify utility
// - Unicode-aware (uses NFKD normalization when available)
// - Strips combining marks (diacritics)
// - Lowercases and collapses non-alphanumerics to single hyphens
// - Optional maxLength truncation (tries not to leave trailing hyphens)
// - Exposes multiple export shapes for CommonJS/ESM compatibility

/* istanbul ignore next - tiny internal helper */
function _toAscii(input) {
  if (!input) return '';
  const s = String(input);
  // Prefer Unicode normalization (NFKD) to decompose diacritics.
  // This is widely available in modern Node.js runtimes and browsers.
  try {
    const normalized = s.normalize && s.normalize('NFKD');
    if (normalized) {
      // strip combining diacritical marks (Unicode ranges)
      return normalized.replace(/[\u0300-\u036f]/g, '');
    }
  } catch (e) {
    // ignore and fallback to basic replacements below
  }

  // Best-effort fallback replacements for common Latin diacritics.
  return s
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

function slugify(input, maxLength) {
  const raw = input == null ? '' : String(input);
  let s = _toAscii(raw);
  s = s
    .toLowerCase()
    .trim()
    // Replace any sequence of non-alphanumeric characters with a single hyphen
    .replace(/[^a-z0-9]+/g, '-')
    // Collapse multiple hyphens
    .replace(/-+/g, '-')
    // Trim leading/trailing hyphens
    .replace(/(^-|-$)/g, '');

  if (typeof maxLength === 'number' && maxLength > 0 && s.length > maxLength) {
    s = s.slice(0, maxLength);
    // Remove trailing hyphen introduced by truncation
    s = s.replace(/(^-|-$)/g, '');
  }

  if (!s) return 'n-a';
  return s;
}

// Expose the internal helper for debugging/tests (non-breaking)
slugify._impl = { toAscii: _toAscii };

// CommonJS and ESM interop helpers.
// Many consumers in this repository use both `require('./slugify')` and
// `import slugify from './slugify'` patterns. Provide a flexible shape so
// both styles receive the function as expected.
try {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = slugify;
    module.exports.slugify = slugify;
    module.exports.default = slugify;
    Object.defineProperty(module.exports, '__esModule', { value: true });
  }
} catch (e) {
  // ignore - defensive
}

// Named export for ESM consumers (if this file is processed as ESM)
export default slugify;
export { slugify, _toAscii as toAscii };
