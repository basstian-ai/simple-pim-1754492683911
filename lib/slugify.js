/* Robust slugify utility
 *
 * - Normalizes unicode (NFKD) to strip diacritics
 * - Converts to lower-case, trims, replaces non-alphanumeric with hyphens
 * - Collapses repeating hyphens and trims leading/trailing hyphens
 * - Optional max length (characters)
 *
 * This file is written to be compatible with CommonJS consumers (module.exports)
 * and provides extra fields to improve interop with ESM import default consumers.
 */

function slugify(input, maxLength = 0) {
  if (input == null) return '';
  let s = String(input);

  // Normalize unicode to decompose accents, then remove diacritic marks.
  // NFKD is broadly supported and safe in Node/modern browsers.
  try {
    s = s.normalize ? s.normalize('NFKD') : s;
  } catch (_) {
    // ignore normalization failures and continue with raw string
  }

  // Remove combining diacritical marks
  s = s.replace(/[\u0300-\u036f\ufe20-\ufe2f]/g, '');

  // Lowercase and trim
  s = s.toLowerCase().trim();

  // Replace anything that is not a-z0-9 with a hyphen
  s = s.replace(/[^a-z0-9]+/g, '-');

  // Collapse multiple hyphens
  s = s.replace(/-+/g, '-');

  // Remove leading/trailing hyphens
  s = s.replace(/^-|-$/g, '');

  if (maxLength && typeof maxLength === 'number' && maxLength > 0) {
    if (s.length > maxLength) {
      s = s.slice(0, maxLength);
      // Trim trailing hyphen if we cut in middle
      s = s.replace(/-$/g, '');
    }
  }

  return s;
}

// Export compat: primary export (CommonJS)
if (typeof module !== 'undefined' && module && typeof module.exports !== 'undefined') {
  try {
    module.exports = slugify;
    // Also provide a default property to help some bundlers/interop layers
    module.exports.default = slugify;
    // Provide named export on exports too
    if (typeof exports === 'object') {
      exports.slugify = slugify;
      exports.default = slugify;
    }
  } catch (_) {
    // ignore
  }
}

// If the environment supports ES module exports, also define an ES default export.
// Using `typeof exports` protects against ReferenceError in ESM contexts.
try {
  if (typeof exports === 'undefined') {
    // Nothing to do; pure ESM environments will typically use `export default` at build time.
  }
} catch (_) {}

// For tooling that statically inspects named exports, expose as property
slugify._impl = {
  normalize: typeof String.prototype.normalize === 'function',
};

// For CommonJS consumers requiring the module object, expose helpers
// (This line is a no-op in ESM as `exports` is handled above).
try { exports.slugify = exports.slugify || slugify; } catch (_) {}

// default export shim for consumers using default import
export default slugify;
