// Lightweight slugify utility used across the app.
// Implemented as CommonJS to match the repository's module style but
// exposes both a direct export and a default property to support
// various import patterns (require, import default, named import).

function slugify(input) {
  const s = input == null ? '' : String(input);
  // Normalize Unicode to decompose diacritics, then remove them.
  // NFKD is well-supported in modern Node environments.
  let out = s.normalize ? s.normalize('NFKD') : s;
  // Remove combining marks
  out = out.replace(/[\u0300-\u036f]/g, '');
  // Lowercase, replace non-alphanumeric sequences with hyphens
  out = out.toLowerCase();
  out = out.replace(/[^a-z0-9]+/g, '-');
  // Trim leading/trailing hyphens and collapse repeats
  out = out.replace(/(^-+|-+$)/g, '').replace(/-+/g, '-');
  // Limit length to keep slugs reasonably small
  if (out.length > 240) out = out.slice(0, 240).replace(/-+$/g, '');
  return out;
}

// CommonJS exports
module.exports = slugify;
module.exports.slugify = slugify;
// Provide a default property so `import slugify from '.../lib/slugify'`
// works regardless of bundler interop settings.
module.exports.default = slugify;

// Also support ES module named export when used via transpilers that
// read `module.exports` (keeps compatibility with various import styles).
try {
  if (typeof exports === 'object') {
    exports.slugify = slugify;
    exports.default = slugify;
  }
} catch (_) {}

// default export shim for consumers using default import
export default slugify;
