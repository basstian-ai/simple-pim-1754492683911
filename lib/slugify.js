/**
 * Small, dependency-free slugify utility for URLs and keys.
 *
 * Exports:
 *  - CommonJS: module.exports = slugify
 *  - Named (legacy): module.exports.slugify = slugify
 *  - Also attaches .default for interop with some bundlers/import patterns.
 *
 * The implementation:
 *  - Uses Unicode NFKD normalization to remove accents where possible
 *  - Lowercases, trims, replaces non-alphanumerics with hyphens
 *  - Collapses repeating hyphens and trims leading/trailing hyphens
 *
 * This file intentionally uses CommonJS exports so both `require()` and
 * ESM `import slugify from '../lib/slugify'` work in the diverse codebase.
 */
'use strict';

function slugify(input) {
  if (input === null || input === undefined) return '';
  const s = String(input);
  try {
    // Normalize to decompose accented characters, then strip combining marks.
    // Fall back to a simple replacement when normalize isn't available.
    const normalized = s.normalize ? s.normalize('NFKD') : s;
    // Remove diacritic marks
    const withoutDiacritics = normalized.replace(/[\u0300-\u036f]/g, '');
    // Convert to lower case, replace non-alphanumeric sequences with hyphen,
    // collapse multiple hyphens and trim leading/trailing hyphens.
    const slug = withoutDiacritics
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/(^-|-$)+/g, '');
    return slug;
  } catch (err) {
    // Very defensive fallback: remove non-word chars, convert to lower-case
    return s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .trim();
  }
}

// CommonJS default export
module.exports = slugify;
// Named export for callers that do `const { slugify } = require(...)` or expect a property
module.exports.slugify = slugify;
// Provide .default to help certain bundlers / transpilation paths which look for default
module.exports.default = slugify;

// Also expose an ES module default when transpiled by bundlers that convert CommonJS -> ESM.

