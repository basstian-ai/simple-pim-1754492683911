const fs = require('fs');
const path = require('path');

let groups = [];

function loadSeed() {
  const seedPath = path.join(process.cwd(), 'data', 'attribute-groups.json');
  try {
    const raw = fs.readFileSync(seedPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      groups = parsed.map((g) => ({ ...g }));
    } else {
      groups = [];
    }
  } catch (e) {
    groups = [];
  }
}

function nowISO() {
  return new Date().toISOString();
}

function genId(prefix = 'grp') {
  // Simple unique id: grp-<timestamp>-<random>
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${rand}`;
}

// Initialize from seed on first load
loadSeed();

function list(options = {}) {
  const { q } = options;
  let result = groups.slice();
  if (q && typeof q === 'string') {
    const needle = q.toLowerCase();
    result = result.filter((g) =>
      g.name.toLowerCase().includes(needle) ||
      (Array.isArray(g.attributes) && g.attributes.some((a) => `${a.code} ${a.label}`.toLowerCase().includes(needle)))
    );
  }
  // sort by position then name for stable order
  result.sort((a, b) => {
    const ap = typeof a.position === 'number' ? a.position : Number.MAX_SAFE_INTEGER;
    const bp = typeof b.position === 'number' ? b.position : Number.MAX_SAFE_INTEGER;
    if (ap !== bp) return ap - bp;
    return a.name.localeCompare(b.name);
  });
  return result;
}

function findById(id) {
  return groups.find((g) => g.id === id) || null;
}

function validateGroupPayload(payload, { partial = false } = {}) {
  const errors = [];
  const out = {};

  if (!partial || payload.name !== undefined) {
    if (typeof payload.name !== 'string' || !payload.name.trim()) {
      errors.push('name is required and must be a non-empty string');
    } else {
      out.name = payload.name.trim();
    }
  }

  if (payload.position !== undefined) {
    const p = Number(payload.position);
    if (!Number.isFinite(p) || p < 0) {
      errors.push('position must be a non-negative number');
    } else {
      out.position = p;
    }
  }

  if (!partial || payload.attributes !== undefined) {
    if (!Array.isArray(payload.attributes)) {
      errors.push('attributes must be an array');
    } else {
      const attrs = [];
      for (const a of payload.attributes) {
        if (!a || typeof a !== 'object') {
          errors.push('each attribute must be an object');
          continue;
        }
        const code = typeof a.code === 'string' ? a.code.trim() : '';
        const label = typeof a.label === 'string' ? a.label.trim() : '';
        const type = typeof a.type === 'string' ? a.type.trim() : '';
        if (!code) errors.push('attribute.code is required');
        if (!label) errors.push('attribute.label is required');
        if (!type) errors.push('attribute.type is required');
        const attr = { code, label, type };
        if (a.options !== undefined) {
          if (!Array.isArray(a.options)) {
            errors.push('attribute.options must be an array when provided');
          } else {
            attr.options = a.options;
          }
        }
        attrs.push(attr);
      }
      if (errors.length === 0) out.attributes = attrs;
    }
  }

  return { errors, value: out };
}

function create(payload) {
  const { errors, value } = validateGroupPayload(payload, { partial: false });
  if (errors.length) {
    const err = new Error('Validation failed');
    err.statusCode = 400;
    err.details = errors;
    throw err;
  }
  const id = genId('grp');
  const now = nowISO();
  const group = {
    id,
    name: value.name,
    attributes: value.attributes || [],
    position: value.position !== undefined ? value.position : groups.length + 1,
    createdAt: now,
    updatedAt: now,
  };
  groups.push(group);
  return group;
}

function update(id, payload) {
  const idx = groups.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  const { errors, value } = validateGroupPayload(payload, { partial: true });
  if (errors.length) {
    const err = new Error('Validation failed');
    err.statusCode = 400;
    err.details = errors;
    throw err;
  }
  const prev = groups[idx];
  const updated = {
    ...prev,
    ...value,
    updatedAt: nowISO(),
  };
  groups[idx] = updated;
  return updated;
}

function remove(id) {
  const idx = groups.findIndex((g) => g.id === id);
  if (idx === -1) return false;
  groups.splice(idx, 1);
  return true;
}

// Internal/testing helper to reset in-memory state from seed
function _resetForTests() {
  loadSeed();
}

module.exports = {
  list,
  findById,
  create,
  update,
  remove,
  _resetForTests,
};
