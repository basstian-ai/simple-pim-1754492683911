const STORAGE_KEY = 'pim.attributeGroups';

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : fallback;
  } catch (_) {
    return fallback;
  }
}

export function slugify(str) {
  if (!str) return '';
  return String(str)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

function generateId() {
  return 'ag_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function loadGroups() {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return safeParse(raw, []);
}

export function saveGroups(groups) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
}

export function clearAllGroups() {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}

export function addGroupPure(groups, { id, name, code }) {
  const gid = id || generateId();
  const finalCode = code && String(code).trim() ? slugify(code) : slugify(name);
  const newGroup = { id: gid, name: String(name || '').trim(), code: finalCode };
  return [...groups, newGroup];
}

export function updateGroupPure(groups, id, patch = {}) {
  return groups.map((g) => {
    if (g.id !== id) return g;
    const next = { ...g, ...patch };
    if (Object.prototype.hasOwnProperty.call(patch, 'code')) {
      next.code = slugify(patch.code);
    }
    if (Object.prototype.hasOwnProperty.call(patch, 'name')) {
      next.name = String(patch.name || '').trim();
    }
    return next;
  });
}

export function deleteGroupPure(groups, id) {
  return groups.filter((g) => g.id !== id);
}

export function moveGroupPure(groups, fromIndex, toIndex) {
  const arr = groups.slice();
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= arr.length ||
    toIndex >= arr.length
  ) {
    return arr;
  }
  const [item] = arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, item);
  return arr;
}
