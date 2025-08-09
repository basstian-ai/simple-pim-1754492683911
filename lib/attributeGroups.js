// Simple in-memory store for Attribute Groups
// Note: This store is ephemeral and resets on serverless cold starts.

let groups = [];
let seq = 1;

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function listGroups() {
  return clone(groups);
}

function getGroup(id) {
  const g = groups.find((x) => x.id === String(id));
  return g ? clone(g) : null;
}

function ensureUniqueName(name, ignoreId) {
  const lower = String(name || '').trim().toLowerCase();
  if (!lower) return;
  const exists = groups.some((g) => g.name.trim().toLowerCase() === lower && g.id !== ignoreId);
  if (exists) {
    const err = new Error('Attribute Group name must be unique');
    err.statusCode = 409;
    throw err;
  }
}

function normalizeAttributes(attrs) {
  if (!Array.isArray(attrs)) return [];
  return attrs
    .map((a) => ({
      code: String(a.code || '').trim(),
      label: String(a.label || '').trim(),
    }))
    .filter((a) => a.code);
}

function validateGroupInput(input) {
  if (!input || typeof input !== 'object') {
    const err = new Error('Invalid body');
    err.statusCode = 400;
    throw err;
  }
  const name = String(input.name || '').trim();
  if (!name) {
    const err = new Error('Name is required');
    err.statusCode = 400;
    throw err;
  }
  const attributes = normalizeAttributes(input.attributes || []);
  return { name, attributes };
}

function createGroup(input) {
  const { name, attributes } = validateGroupInput(input);
  ensureUniqueName(name);
  const id = String(seq++);
  const now = new Date().toISOString();
  const group = { id, name, attributes, createdAt: now, updatedAt: now };
  groups.push(group);
  return clone(group);
}

function updateGroup(id, updates) {
  const idx = groups.findIndex((x) => x.id === String(id));
  if (idx === -1) {
    const err = new Error('Not found');
    err.statusCode = 404;
    throw err;
  }
  const { name, attributes } = validateGroupInput({
    name: updates.name != null ? updates.name : groups[idx].name,
    attributes: updates.attributes != null ? updates.attributes : groups[idx].attributes,
  });
  ensureUniqueName(name, String(id));
  const updated = {
    ...groups[idx],
    name,
    attributes: normalizeAttributes(attributes),
    updatedAt: new Date().toISOString(),
  };
  groups[idx] = updated;
  return clone(updated);
}

function deleteGroup(id) {
  const idx = groups.findIndex((x) => x.id === String(id));
  if (idx === -1) {
    const err = new Error('Not found');
    err.statusCode = 404;
    throw err;
  }
  const removed = groups.splice(idx, 1)[0];
  return clone(removed);
}

// Utilities for tests
function resetStore() {
  groups = [];
  seq = 1;
}

module.exports = {
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  resetStore,
};
