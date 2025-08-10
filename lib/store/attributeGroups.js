'use strict';

// Simple in-memory store for Attribute Groups
// Persists in-memory across hot reloads via globalThis during a server process lifetime
const GLOBAL_KEY = '__SIMPLE_PIM_ATTRIBUTE_GROUPS__';

function initStore() {
  if (!globalThis[GLOBAL_KEY]) {
    globalThis[GLOBAL_KEY] = {
      seq: 1,
      groups: []
    };
  }
  return globalThis[GLOBAL_KEY];
}

function nextId(store) {
  const id = String(store.seq++);
  return id;
}

function listGroups() {
  const store = initStore();
  // Return deep copy to avoid external mutation
  return JSON.parse(JSON.stringify(store.groups));
}

function getGroup(id) {
  const store = initStore();
  const g = store.groups.find((gr) => String(gr.id) === String(id));
  return g ? JSON.parse(JSON.stringify(g)) : null;
}

function createGroup({ name, description }) {
  const store = initStore();
  if (!name || typeof name !== 'string' || !name.trim()) {
    const err = new Error('name is required');
    err.statusCode = 400;
    throw err;
  }
  const now = new Date().toISOString();
  const group = {
    id: nextId(store),
    name: name.trim(),
    description: description ? String(description) : '',
    attributes: [],
    createdAt: now,
    updatedAt: now
  };
  store.groups.push(group);
  return JSON.parse(JSON.stringify(group));
}

function updateGroup(id, patch) {
  const store = initStore();
  const idx = store.groups.findIndex((gr) => String(gr.id) === String(id));
  if (idx === -1) {
    const err = new Error('group not found');
    err.statusCode = 404;
    throw err;
  }
  const current = store.groups[idx];
  const updated = { ...current };

  if (patch.name !== undefined) {
    const name = String(patch.name).trim();
    if (!name) {
      const err = new Error('name cannot be empty');
      err.statusCode = 400;
      throw err;
    }
    updated.name = name;
  }
  if (patch.description !== undefined) {
    updated.description = String(patch.description);
  }
  if (Array.isArray(patch.attributes)) {
    // Basic normalization of attributes
    updated.attributes = patch.attributes.map((a, i) => normalizeAttribute(a, current.attributes[i]));
  }
  updated.updatedAt = new Date().toISOString();
  store.groups[idx] = updated;
  return JSON.parse(JSON.stringify(updated));
}

function deleteGroup(id) {
  const store = initStore();
  const idx = store.groups.findIndex((gr) => String(gr.id) === String(id));
  if (idx === -1) {
    const err = new Error('group not found');
    err.statusCode = 404;
    throw err;
  }
  const [removed] = store.groups.splice(idx, 1);
  return JSON.parse(JSON.stringify(removed));
}

function normalizeAttribute(attr, previous) {
  const obj = { ...previous, ...attr };
  if (!obj.id) obj.id = generateAttrId();
  if (!obj.name || !String(obj.name).trim()) {
    const err = new Error('attribute.name is required');
    err.statusCode = 400;
    throw err;
  }
  obj.name = String(obj.name).trim();
  obj.type = obj.type ? String(obj.type) : 'text';
  if (obj.type === 'select' && !Array.isArray(obj.values)) {
    obj.values = [];
  }
  return obj;
}

function generateAttrId() {
  const store = initStore();
  // Reuse global seq for simplicity but prefix with 'a'
  return 'a' + nextId(store);
}

module.exports = {
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup
};
