const STORAGE_KEY = 'pim_attribute_groups_v1';

function _getStorage(storage) {
  if (storage) return storage;
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  if (typeof globalThis !== 'undefined') {
    if (!globalThis.__PIM_FAKE_STORAGE__) {
      const mem = {};
      globalThis.__PIM_FAKE_STORAGE__ = {
        getItem: (k) => (k in mem ? mem[k] : null),
        setItem: (k, v) => {
          mem[k] = String(v);
        },
        removeItem: (k) => {
          delete mem[k];
        },
      };
    }
    return globalThis.__PIM_FAKE_STORAGE__;
  }
  const mem = {};
  return {
    getItem: (k) => (k in mem ? mem[k] : null),
    setItem: (k, v) => {
      mem[k] = String(v);
    },
    removeItem: (k) => {
      delete mem[k];
    },
  };
}

function _read(storage) {
  const s = _getStorage(storage);
  const raw = s.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    return [];
  }
}

function _write(groups, storage) {
  const s = _getStorage(storage);
  s.setItem(STORAGE_KEY, JSON.stringify(groups));
}

function listGroups(storage) {
  const groups = _read(storage);
  return groups.slice().sort((a, b) => a.name.localeCompare(b.name));
}

function _genId() {
  return 'ag_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

function createGroup(data, storage) {
  const name = (data && data.name ? String(data.name) : '').trim();
  if (!name) throw new Error('Attribute Group name is required');
  const description = (data && data.description ? String(data.description) : '').trim();
  const attributes = Array.isArray(data && data.attributes) ? data.attributes : [];
  const groups = _read(storage);
  const newGroup = {
    id: data && data.id ? String(data.id) : _genId(),
    name,
    description,
    attributes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  groups.push(newGroup);
  _write(groups, storage);
  return newGroup;
}

function updateGroup(id, patch, storage) {
  const groups = _read(storage);
  const idx = groups.findIndex((g) => g.id === id);
  if (idx === -1) throw new Error('Attribute Group not found');
  const current = groups[idx];
  const next = { ...current };
  if (patch && typeof patch.name !== 'undefined') {
    const name = String(patch.name).trim();
    if (!name) throw new Error('Attribute Group name is required');
    next.name = name;
  }
  if (patch && typeof patch.description !== 'undefined') {
    next.description = String(patch.description);
  }
  if (patch && typeof patch.attributes !== 'undefined') {
    next.attributes = Array.isArray(patch.attributes) ? patch.attributes : [];
  }
  next.updatedAt = new Date().toISOString();
  groups[idx] = next;
  _write(groups, storage);
  return next;
}

function deleteGroup(id, storage) {
  const groups = _read(storage);
  const next = groups.filter((g) => g.id !== id);
  const deleted = next.length !== groups.length;
  if (deleted) _write(next, storage);
  return deleted;
}

module.exports = {
  STORAGE_KEY,
  listGroups,
  createGroup,
  updateGroup,
  deleteGroup,
};
