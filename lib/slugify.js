// Robust slugify helper
// - Uses Unicode NFKD normalization to strip diacritics where possible
// - Collapses non-alphanumerics to single hyphens
// - Trims leading/trailing hyphens
// - Optionally enforces maxLength (preserves whole slug start)
// - Exposes multiple export shapes for CommonJS / ESM interop
//
// Notes:
// - This intentionally avoids external dependencies to keep the bundle small.
// - It is defensive: on unexpected input it returns an empty string.

function _toAscii(input) {
  if (typeof input !== 'string') return '';
  // Normalize to NFKD to split combined characters (e.g. é -> e + ́)
  // Then remove combining diacritical marks.
  // The \u0300-\u036f range covers most combining marks.
  try {
    return input.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  } catch (e) {
    // If normalization is not supported for some reason, fallback to raw input.
    return input;
  }
}

/**
 * slugify(value [, opts])
 * opts:
 *  - maxLength: number (optional) - truncate slug to this length (best-effort)
 */
function slugify(value, opts) {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (s.length === 0) return '';

  const maxLength = opts && typeof opts.maxLength === 'number' && opts.maxLength > 0 ? Math.floor(opts.maxLength) : null;

  // 1) Convert to ASCII-friendly form (strip diacritics)
  let out = _toAscii(s);

  // 2) Lowercase
  out = out.toLowerCase();

  // 3) Replace any non-alphanumeric sequences with a single hyphen.
  // Allow a-z, 0-9. Other scripts will be stripped to best-effort ascii above.
  out = out.replace(/[^a-z0-9]+/g, '-');

  // 4) Collapse multiple hyphens, trim edges
  out = out.replace(/-+/g, '-').replace(/(^-|-$)/g, '');

  // 5) Enforce max length while keeping it a clean slug (no trailing hyphens)
  if (maxLength && out.length > maxLength) {
    out = out.slice(0, maxLength);
    out = out.replace(/-+$/g, ''); // trim trailing hyphens after cut
    // If cutting produced an empty slug (rare), fall back to a deterministic short id
    if (!out) {
      // deterministic fallback from input: use first alnum chars
      const fallback = s.replace(/[^a-z0-9]+/gi, '').slice(0, Math.max(3, Math.min(8, maxLength)));
      out = fallback.toLowerCase();
    }
  }

  return out;
}

// Additional exports for debug / testing
slugify._impl = {
  toAscii: _toAscii,
};

// CommonJS + ESM compatibility shims
// Many modules in this repo sometimes `require()` this file and sometimes import default.
module.exports = slugify;
module.exports.default = slugify;
module.exports.slugify = slugify;
module.exports.__esModule = true;

// Also provide a named export when importing via destructuring in CJS contexts
exports.slugify = slugify;

// default export shim for consumers using default import
export default slugify;
