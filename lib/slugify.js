/* Unicode-aware slugify utility
 *
 * - Normalizes input using NFKD and strips combining marks (diacritics)
 * - Replaces non-alphanumeric characters with hyphens
 * - Collapses consecutive hyphens and trims leading/trailing hyphens
 * - Lowercases the result
 * - Exposes both CommonJS and CommonJS-with-default shapes to maximize
 *   compatibility with different import styles across the codebase.
 *
 * Keep this module CommonJS-style to match the repository patterns while
 * providing `module.exports.default` and `exports.slugify` shims so callers
 * that import as default or named still receive the function.
 */

function toAscii(str) {
  if (typeof str !== 'string') return '';
  try {
    // Normalize to NFKD form and strip combining diacritical marks.
    // This keeps the implementation dependency-free while improving
    // slug quality for many international inputs.
    return str.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  } catch (e) {
    // If normalization isn't supported for some reason, fallback to original string.
    return str;
  }
}

function slugify(input, opts) {
  if (input == null) return '';
  const options = opts || {};
  const maxLength = typeof options.maxLength === 'number' && options.maxLength > 0 ? Math.floor(options.maxLength) : undefined;

  let s = String(input);
  // Convert to ASCII-like by removing diacritics
  s = toAscii(s);
  // Lowercase
  s = s.toLowerCase();
  // Replace any sequence of non-alphanumeric characters with a hyphen
  s = s.replace(/[^a-z0-9]+/g, '-');
  // Collapse multiple hyphens
  s = s.replace(/-+/g, '-');
  // Trim leading/trailing hyphens
  s = s.replace(/(^-|-$)/g, '');
  if (maxLength && s.length > maxLength) {
    s = s.slice(0, maxLength);
    // Trim any trailing hyphen created by the slice
    s = s.replace(/-$/g, '');
  }
  return s;
}

// Export (CommonJS) and provide compatibility shims commonly needed when
// modules are imported via `import slugify from '...'` or `require('...')`.
module.exports = slugify;
module.exports.default = slugify;
module.exports.slugify = slugify;
exports.slugify = slugify;
// Mark as an ES module for some bundlers that check this flag
module.exports.__esModule = true;

// Small diagnostics helpers used by tests or debugging tools
module.exports._impl = { toAscii };


try {
  // eslint-disable-next-line no-undef
  if (typeof exports === 'object') exports.default = exports.default || slugify;
} catch (_) {}

// default export shim for consumers using default import
export default slugify;
