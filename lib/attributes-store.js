export const STORAGE_KEY = 'pim_attribute_groups';

export function readGroups() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data;
    return [];
  } catch (e) {
    console.warn('Failed to read attribute groups from storage', e);
    return [];
  }
}

export function writeGroups(groups) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(groups || []));
  } catch (e) {
    console.warn('Failed to write attribute groups to storage', e);
  }
}
