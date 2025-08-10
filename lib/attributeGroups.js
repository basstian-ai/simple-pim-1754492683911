/* Simple helpers for Attribute Groups domain */

// Generate a reasonably unique id without external deps
function generateId(prefix = 'ag_') {
  return (
    prefix +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}

// Parse a user-entered string of attributes into a clean array
// Supports comma and newline separators
function parseAttributesString(input) {
  if (!input) return [];
  const raw = Array.isArray(input) ? input.join(',') : String(input);
  const items = raw
    .split(/[,\n]/g)
    .map((s) => s.trim())
    .filter(Boolean);
  // de-duplicate preserving order
  const seen = new Set();
  const result = [];
  for (const a of items) {
    const key = a.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(a);
    }
  }
  return result;
}

function normalizeGroup(input) {
  const id = input && input.id ? String(input.id) : generateId();
  const name = input && input.name ? String(input.name).trim() : '';
  let attributes = [];
  if (input && Array.isArray(input.attributes)) {
    attributes = parseAttributesString(input.attributes);
  } else if (input && typeof input.attributes === 'string') {
    attributes = parseAttributesString(input.attributes);
  }
  return { id, name, attributes };
}

function validateGroup(group) {
  const errors = [];
  if (!group || typeof group !== 'object') {
    return { valid: false, errors: ['Group is required'] };
  }
  const name = (group.name || '').trim();
  if (!name) {
    errors.push('Name is required');
  } else if (name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (!Array.isArray(group.attributes)) {
    errors.push('Attributes must be an array');
  } else {
    const cleaned = group.attributes.map((a) => String(a).trim()).filter(Boolean);
    if (cleaned.length === 0) {
      errors.push('At least one attribute is required');
    }
  }
  return { valid: errors.length === 0, errors };
}

module.exports = {
  normalizeGroup,
  validateGroup,
  parseAttributesString,
};
