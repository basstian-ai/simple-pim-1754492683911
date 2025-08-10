/*
  Lightweight attribute groups storage and utilities
  - Persists to localStorage in the browser
  - Safe no-op on server (SSR) until hydrated
*/

const STORAGE_KEY = 'pim.attributeGroups';

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function generateId() {
  // Simple, URL-safe id: timestamp + random
  const rand = Math.random().toString(36).slice(2, 10);
  const now = Date.now().toString(36);
  return `${now}-${rand}`;
}

function readStorage() {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (_e) {
    return [];
  }
}

function writeStorage(groups) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  } catch (_e) {
    // ignore
  }
}

function listGroups() {
  return readStorage();
}

function saveGroups(groups) {
  writeStorage(groups);
  return groups;
}

function upsertGroup(group) {
  const groups = readStorage();
  const idx = groups.findIndex(g => g.id === group.id);
  if (idx >= 0) {
    groups[idx] = { ...groups[idx], ...group, updatedAt: new Date().toISOString() };
  } else {
    const id = group.id || generateId();
    groups.push({ id, name: group.name || '', description: group.description || '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  writeStorage(groups);
  return groups;
}

function deleteGroup(id) {
  const groups = readStorage().filter(g => g.id !== id);
  writeStorage(groups);
  return groups;
}

function exportGroupsJson() {
  const groups = readStorage();
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), groups }, null, 2);
}

function importGroupsJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    const groups = Array.isArray(parsed?.groups) ? parsed.groups : Array.isArray(parsed) ? parsed : [];
    // normalize
    const normalized = groups.map(g => ({
      id: g.id || generateId(),
      name: String(g.name || ''),
      description: String(g.description || ''),
      createdAt: g.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    writeStorage(normalized);
    return normalized;
  } catch (_e) {
    return readStorage();
  }
}

// Utility to group attributes by attributeGroupId
// attributes: [{ id, name, attributeGroupId }]
function groupAttributesByGroupId(groups, attributes) {
  const byId = {};
  const groupIds = (groups || []).map(g => g.id);
  // Initialize map keys for known groups
  for (const id of groupIds) byId[id] = [];
  for (const a of attributes || []) {
    if (a && a.attributeGroupId) {
      if (!byId[a.attributeGroupId]) byId[a.attributeGroupId] = [];
      byId[a.attributeGroupId].push(a);
    }
  }
  return byId;
}

module.exports = {
  STORAGE_KEY,
  isBrowser,
  generateId,
  listGroups,
  saveGroups,
  upsertGroup,
  deleteGroup,
  exportGroupsJson,
  importGroupsJson,
  groupAttributesByGroupId
};
