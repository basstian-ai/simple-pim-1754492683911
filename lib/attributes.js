'use strict';

// Lightweight attributes/groups utilities and safe client storage

const ALLOWED_TYPES = ['text', 'number', 'select'];

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function createId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

function createAttribute(nameOrCode, type = 'text', nameOverride) {
  const name = nameOverride || String(nameOrCode || '').trim();
  const codeSeed = typeof nameOrCode === 'string' ? nameOrCode : name;
  const code = slugify(codeSeed || name);
  const attr = {
    id: createId('attr'),
    code: code || createId('code'),
    name: name || code || 'Attribute',
    type: ALLOWED_TYPES.includes(type) ? type : 'text'
  };
  return attr;
}

function createGroup(name) {
  const code = slugify(name) || createId('grp');
  return {
    id: createId('grp'),
    code,
    name: String(name || 'Group'),
    attributes: []
  };
}

function validateGroup(group) {
  if (!group || typeof group !== 'object') return false;
  if (typeof group.id !== 'string') return false;
  if (typeof group.name !== 'string') return false;
  if (typeof group.code !== 'string') return false;
  if (!Array.isArray(group.attributes)) return false;
  for (const a of group.attributes) {
    if (!a || typeof a !== 'object') return false;
    if (typeof a.id !== 'string') return false;
    if (typeof a.code !== 'string') return false;
    if (typeof a.name !== 'string') return false;
    if (!ALLOWED_TYPES.includes(a.type)) return false;
  }
  return true;
}

const DEFAULT_GROUPS = [
  (() => {
    const g = createGroup('Basic');
    g.attributes.push(createAttribute('name', 'text', 'Name'));
    g.attributes.push(createAttribute('sku', 'text', 'SKU'));
    g.attributes.push(createAttribute('price', 'number', 'Price'));
    return g;
  })(),
  (() => {
    const g = createGroup('Variant');
    g.attributes.push(createAttribute('color', 'text', 'Color'));
    g.attributes.push(createAttribute('size', 'text', 'Size'));
    return g;
  })()
];

const STORAGE_KEY = 'pim.attributeGroups.v1';
let memoryStore = null; // SSR/in-memory fallback so UI can still work per session

function loadGroups() {
  try {
    if (isBrowser()) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_GROUPS.map(clone);
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every(validateGroup)) return parsed;
    } else if (Array.isArray(memoryStore)) {
      return memoryStore.map(clone);
    }
  } catch (_) {}
  return DEFAULT_GROUPS.map(clone);
}

function saveGroups(groups) {
  const safe = Array.isArray(groups) ? groups.filter(validateGroup) : [];
  try {
    if (isBrowser()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    } else {
      memoryStore = safe.map(clone);
    }
  } catch (_) {
    // ignore
  }
}

function clone(v) {
  return JSON.parse(JSON.stringify(v));
}

function upsertGroup(groups, group) {
  const list = Array.isArray(groups) ? clone(groups) : [];
  const idx = list.findIndex(g => g.id === group.id);
  if (idx >= 0) list[idx] = clone(group); else list.push(clone(group));
  return list;
}

function removeGroup(groups, groupId) {
  return (Array.isArray(groups) ? groups : []).filter(g => g.id !== groupId);
}

function addAttributeToGroup(groups, groupId, attribute) {
  const list = clone(groups);
  const g = list.find(x => x.id === groupId);
  if (!g) return list;
  g.attributes = g.attributes.concat([clone(attribute)]);
  return list;
}

function removeAttributeFromGroup(groups, groupId, attrId) {
  const list = clone(groups);
  const g = list.find(x => x.id === groupId);
  if (!g) return list;
  g.attributes = g.attributes.filter(a => a.id !== attrId);
  return list;
}

module.exports = {
  ALLOWED_TYPES,
  createId,
  slugify,
  createAttribute,
  createGroup,
  validateGroup,
  DEFAULT_GROUPS,
  loadGroups,
  saveGroups,
  upsertGroup,
  removeGroup,
  addAttributeToGroup,
  removeAttributeFromGroup
};
