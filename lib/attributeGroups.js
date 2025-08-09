const STORAGE_KEY = 'pim.attributeGroups.v1';

// Simple in-memory storage fallback for SSR and tests
const createMemoryStorage = () => {
  const store = new Map();
  return {
    getItem: (key) => {
      const v = store.get(key);
      return typeof v === 'undefined' ? null : String(v);
    },
    setItem: (key, value) => {
      store.set(key, String(value));
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => store.clear(),
    _dump: () => Object.fromEntries(store.entries()),
  };
};

const memoryStorage = createMemoryStorage();

function getDefaultStorage() {
  if (typeof window !== 'undefined' && window && window.localStorage) {
    return window.localStorage;
  }
  return memoryStorage;
}

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return fallback;
  }
}

function generateId() {
  // Collision-resistant enough for client-side usage
  const rand = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36);
  return `${time}-${rand}`;
}

function loadGroups(storage = getDefaultStorage()) {
  const raw = storage.getItem(STORAGE_KEY);
  const groups = safeParse(raw, []);
  if (!Array.isArray(groups)) return [];
  return groups;
}

function saveGroups(groups, storage = getDefaultStorage()) {
  const data = Array.isArray(groups) ? groups : [];
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function createGroup({ name, description = '', attributes = [] }) {
  const id = generateId();
  const normalizedAttrs = Array.isArray(attributes)
    ? attributes.map((a) => String(a).trim()).filter(Boolean)
    : [];
  return { id, name: String(name || '').trim(), description: String(description || '').trim(), attributes: normalizedAttrs };
}

function upsertGroup(group, storage = getDefaultStorage()) {
  const groups = loadGroups(storage);
  const idx = groups.findIndex((g) => g.id === group.id);
  let next;
  if (idx === -1) {
    next = [...groups, group];
  } else {
    next = groups.slice();
    next[idx] = group;
  }
  saveGroups(next, storage);
  return next;
}

function deleteGroup(id, storage = getDefaultStorage()) {
  const groups = loadGroups(storage);
  const next = groups.filter((g) => g.id !== id);
  saveGroups(next, storage);
  return next;
}

function clearAll(storage = getDefaultStorage()) {
  storage.removeItem(STORAGE_KEY);
}

module.exports = {
  STORAGE_KEY,
  memoryStorage,
  getDefaultStorage,
  loadGroups,
  saveGroups,
  createGroup,
  upsertGroup,
  deleteGroup,
  clearAll,
};
