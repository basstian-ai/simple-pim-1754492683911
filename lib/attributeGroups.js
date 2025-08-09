const STORAGE_KEY = 'pim.attributeGroups';

function getStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch (e) {}
  try {
    if (typeof global !== 'undefined' && global.localStorage) return global.localStorage;
  } catch (e) {}
  return null;
}

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return fallback;
  }
}

function loadAttributeGroups() {
  const storage = getStorage();
  if (!storage) return [];
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const data = safeParse(raw, []);
  if (!Array.isArray(data)) return [];
  return data;
}

function saveAttributeGroups(groups) {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(groups || []));
  } catch (e) {
    // ignore quota or serialization errors
  }
}

function generateId(prefix = 'ag') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function upsertGroup(groups, group) {
  const list = Array.isArray(groups) ? groups.slice() : [];
  const idx = group && group.id ? list.findIndex(g => g.id === group.id) : -1;
  let next;
  if (idx >= 0) {
    next = list.slice();
    next[idx] = { ...list[idx], ...group };
  } else {
    const id = group.id || generateId('ag');
    next = list.concat([{ id, name: group.name || '', description: group.description || '', attributes: group.attributes || [] }]);
    group = { ...group, id };
  }
  return { list: next, group };
}

function removeGroup(groups, id) {
  return (Array.isArray(groups) ? groups : []).filter(g => g.id !== id);
}

function upsertAttribute(group, attribute) {
  const g = { ...group };
  const attrs = Array.isArray(g.attributes) ? g.attributes.slice() : [];
  const idx = attribute && attribute.id ? attrs.findIndex(a => a.id === attribute.id) : -1;
  if (idx >= 0) {
    attrs[idx] = { ...attrs[idx], ...attribute };
  } else {
    attrs.push({ id: attribute.id || generateId('attr'), code: attribute.code || '', label: attribute.label || '', type: attribute.type || 'text', options: attribute.options || [] });
  }
  g.attributes = attrs;
  return g;
}

function removeAttribute(group, attrId) {
  const g = { ...group };
  g.attributes = (Array.isArray(g.attributes) ? g.attributes : []).filter(a => a.id !== attrId);
  return g;
}

module.exports = {
  STORAGE_KEY,
  getStorage,
  loadAttributeGroups,
  saveAttributeGroups,
  generateId,
  upsertGroup,
  removeGroup,
  upsertAttribute,
  removeAttribute,
};
