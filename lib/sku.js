'use strict';

function slugify(input) {
  if (!input || typeof input !== 'string') return '';
  const ascii = input.normalize ? input.normalize('NFKD') : input;
  const noDiacritics = ascii.replace(/[\u0300-\u036f]/g, '');
  const replaced = noDiacritics
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[\-_]+|[\-_]+$/g, '');
  return replaced.toUpperCase();
}

function generateSku(name, opts) {
  const options = opts || {};
  const slug = slugify(name);
  if (!slug) return '';
  let hash = 0 >>> 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash * 31) + slug.charCodeAt(i)) >>> 0;
  }
  let code = hash.toString(36).toUpperCase();
  if (code.length < 6) code = code.padStart(6, '0');
  else code = code.slice(-6);
  const parts = [];
  if (options.prefix) parts.push(String(options.prefix).toUpperCase());
  parts.push(slug, code);
  return parts.join('-');
}

module.exports = { slugify, generateSku };