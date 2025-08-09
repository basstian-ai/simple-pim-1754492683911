/* Pure attribute/group helpers for PIM (no browser APIs) */

const ALLOWED_TYPES = ["text", "number", "boolean", "select"];

function normalizeCode(input) {
  const base = (input || "").toString().trim().toLowerCase();
  if (!base) return "";
  return base
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .substring(0, 60);
}

function uniqueStrings(arr) {
  const out = [];
  const seen = new Set();
  for (const v of arr) {
    const s = (v || "").toString().trim();
    if (!s) continue;
    const key = s.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(s);
    }
  }
  return out;
}

function normalizeAttribute(attr) {
  const a = attr || {};
  const label = (a.label || a.name || a.code || "").toString().trim();
  const code = normalizeCode(a.code || a.name || label);
  let type = ((a.type || "text") + "").toLowerCase().trim();
  if (!ALLOWED_TYPES.includes(type)) type = "text";
  let options = [];
  if (type === "select") {
    if (Array.isArray(a.options)) {
      options = uniqueStrings(a.options);
    } else if (typeof a.options === "string") {
      options = uniqueStrings(a.options.split(/\r?\n|,/g));
    } else {
      options = [];
    }
  }
  return {
    id: a.id || null,
    code,
    label: label || code,
    type,
    required: !!a.required,
    options,
  };
}

function validateGroup(group) {
  const g = group || {};
  const errors = [];
  const name = (g.name || "").toString().trim();
  if (!name) errors.push("Group name is required");
  const attrs = Array.isArray(g.attributes) ? g.attributes : [];
  const codes = new Set();
  for (let i = 0; i < attrs.length; i++) {
    const raw = attrs[i] || {};
    const a = normalizeAttribute(raw);
    if (!a.code) errors.push(`Attribute #${i + 1}: code is required`);
    if (!ALLOWED_TYPES.includes(a.type)) errors.push(`Attribute ${a.code || "#" + (i + 1)}: invalid type '${a.type}'`);
    if (a.type === "select") {
      if (!Array.isArray(a.options) || a.options.length === 0) {
        errors.push(`Attribute ${a.code || "#" + (i + 1)}: at least one option required for 'select' type`);
      }
    }
    const key = a.code;
    if (key) {
      if (codes.has(key)) {
        errors.push(`Duplicate attribute code '${key}' in group`);
      } else {
        codes.add(key);
      }
    }
  }
  return { valid: errors.length === 0, errors };
}

module.exports = { normalizeAttribute, validateGroup, ALLOWED_TYPES };
