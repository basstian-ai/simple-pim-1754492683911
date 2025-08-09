/*
  Simple SKU generator utilities for the PIM
  - Deterministic, human-friendly, uppercased
  - Encodes product name + optional attribute pairs
*/

function sanitize(input) {
  if (!input) return '';
  return String(input)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-zA-Z0-9\s]+/g, ' ') // keep letters, numbers, space
    .replace(/\s+/g, ' ')
    .trim();
}

function twoLetters(str) {
  const s = sanitize(str).toUpperCase().replace(/\s+/g, '');
  return s.slice(0, 2);
}

function threeLetters(str) {
  const s = sanitize(str).toUpperCase().replace(/\s+/g, '');
  return s.slice(0, 3);
}

function stableEntries(attrs) {
  if (!attrs) return [];
  if (Array.isArray(attrs)) {
    return attrs
      .map((it) => [String(it.key ?? it.name ?? ''), String(it.value ?? '')])
      .filter(([k]) => k !== '')
      .sort(([a], [b]) => a.localeCompare(b));
  }
  if (typeof attrs === 'object') {
    return Object.entries(attrs)
      .map(([k, v]) => [String(k), String(v)])
      .filter(([k]) => k !== '')
      .sort(([a], [b]) => a.localeCompare(b));
  }
  return [];
}

function checksumBase36(str) {
  // 32-bit unsigned rolling hash, mod 36^4, padded to 4
  let h = 0 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  const mod = h % 1679616; // 36^4
  return mod.toString(36).toUpperCase().padStart(4, '0');
}

function buildNameCode(name) {
  const cleaned = sanitize(name).toUpperCase();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'PRD';
  const parts = words.map((w) => threeLetters(w)).filter(Boolean);
  const code = parts.join('');
  return code || 'PRD';
}

function buildAttrCode(attrs) {
  const entries = stableEntries(attrs);
  if (entries.length === 0) return '';
  const parts = entries.map(([k, v]) => `${twoLetters(k)}${twoLetters(v)}`);
  return parts.join('-');
}

export function generateSKU(name, attrs) {
  const base = buildNameCode(name);
  const attrPart = buildAttrCode(attrs);
  const fingerprint = checksumBase36(
    `${sanitize(name)}|${JSON.stringify(stableEntries(attrs))}`
  );
  if (attrPart) return `${base}-${attrPart}-${fingerprint}`;
  return `${base}-${fingerprint}`;
}

// Utility to parse textarea input where each line is `key=value`
export function parseKeyValueLines(text) {
  if (!text) return {};
  const lines = String(text).split(/\r?\n/);
  const out = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!key) continue;
    out[key] = value;
  }
  return out;
}

export default generateSKU;
