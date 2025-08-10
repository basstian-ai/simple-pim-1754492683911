/*
  Attribute Groups utilities for the Simple PIM
  - Pure functions for working with attribute groups
  - LocalStorage helpers for client-side persistence

  Group shape:
  {
    id: string,
    name: string,
    slug: string,
    attributes: Array<{
      code: string,
      label: string,
      type: 'text'|'number'|'select',
      options?: string[]
    }>,
    createdAt: string,
    updatedAt: string,
  }
*/

export function slugify(str) {
  if (!str) return '';
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/["']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function randomId(prefix = 'grp') {
  // Lightweight unique id; fine for client-side usage
  const rnd = Math.random().toString(36).slice(2, 8);
  const ts = Date.now().toString(36);
  return `${prefix}_${ts}_${rnd}`;
}

export function normalizeAttribute(attr) {
  const a = { code: '', label: '', type: 'text', options: [], ...(attr || {}) };
  a.code = slugify(a.code || a.label);
  if (a.type !== 'text' && a.type !== 'number' && a.type !== 'select') {
    a.type = 'text';
  }
  if (a.type !== 'select') {
    a.options = [];
  } else if (!Array.isArray(a.options)) {
    a.options = [];
  }
  return a;
}

export function normalizeGroup(input) {
  const now = new Date().toISOString();
  const g = {
    id: input?.id || randomId(),
    name: (input?.name || '').trim(),
    slug: slugify(input?.slug || input?.name || input?.id || ''),
    attributes: Array.isArray(input?.attributes)
      ? input.attributes.map(normalizeAttribute)
      : [],
    createdAt: input?.createdAt || now,
    updatedAt: now,
  };
  return g;
}

export function validateGroup(group) {
  const errors = [];
  if (!group) return { ok: false, errors: ['Group is required'] };

  const name = (group.name || '').trim();
  if (!name) errors.push('Name is required');

  const slug = slugify(group.slug || group.name);
  if (!slug) errors.push('Slug is required');

  const seenCodes = new Set();
  const seenLabels = new Set();
  (group.attributes || []).forEach((a, idx) => {
    const code = slugify(a.code || a.label);
    const label = (a.label || '').trim();
    if (!label) errors.push(`Attribute #${idx + 1}: label is required`);
    if (!code) errors.push(`Attribute #${idx + 1}: code is required`);
    if (code && seenCodes.has(code)) errors.push(`Duplicate attribute code: ${code}`);
    if (label && seenLabels.has(label.toLowerCase())) errors.push(`Duplicate attribute label: ${label}`);
    seenCodes.add(code);
    seenLabels.add(label.toLowerCase());

    const type = a.type || 'text';
    if (!['text', 'number', 'select'].includes(type)) {
      errors.push(`Attribute #${idx + 1}: invalid type: ${type}`);
    }
    if (type === 'select') {
      const opts = Array.isArray(a.options) ? a.options : [];
      if (opts.length === 0) errors.push(`Attribute #${idx + 1}: select options required`);
    }
  });

  return { ok: errors.length === 0, errors };
}

function ensureUniqueSlug(groups, baseSlug, excludeId) {
  const taken = new Set(
    (groups || []).filter((g) => g.id !== excludeId).map((g) => g.slug)
  );
  if (!taken.has(baseSlug)) return baseSlug;
  let i = 2;
  let candidate = `${baseSlug}-${i}`;
  while (taken.has(candidate)) {
    i += 1;
    candidate = `${baseSlug}-${i}`;
  }
  return candidate;
}

export function upsertGroup(groups, inputGroup) {
  const arr = Array.isArray(groups) ? groups.slice() : [];
  const draft = normalizeGroup(inputGroup);
  // assign unique slug
  draft.slug = ensureUniqueSlug(arr, draft.slug || slugify(draft.name), draft.id);

  const idx = arr.findIndex((g) => g.id === draft.id || g.slug === draft.slug);
  if (idx === -1) {
    arr.push(draft);
  } else {
    draft.createdAt = arr[idx].createdAt || draft.createdAt;
    arr[idx] = { ...arr[idx], ...draft, updatedAt: new Date().toISOString() };
  }
  return arr;
}

export function removeGroup(groups, id) {
  const arr = Array.isArray(groups) ? groups : [];
  return arr.filter((g) => g.id !== id);
}

const LS_KEY = 'pim.attributeGroups';

export function loadGroupsFromLocalStorage() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeGroup);
  } catch (e) {
    return [];
  }
}

export function saveGroupsToLocalStorage(groups) {
  if (typeof window === 'undefined') return;
  try {
    const cleaned = (Array.isArray(groups) ? groups : []).map((g) => ({
      id: g.id,
      name: g.name,
      slug: g.slug,
      attributes: (g.attributes || []).map((a) => ({
        code: slugify(a.code || a.label),
        label: a.label,
        type: a.type,
        options: a.type === 'select' ? (a.options || []) : [],
      })),
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
    }));
    window.localStorage.setItem(LS_KEY, JSON.stringify(cleaned));
  } catch (e) {
    // ignore
  }
}

export function exampleGroups() {
  return [
    normalizeGroup({
      name: 'Apparel',
      attributes: [
        { code: 'color', label: 'Color', type: 'select', options: ['Red', 'Blue', 'Black', 'White'] },
        { code: 'size', label: 'Size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL'] },
        { code: 'material', label: 'Material', type: 'text' },
      ],
    }),
    normalizeGroup({
      name: 'Electronics',
      attributes: [
        { code: 'brand', label: 'Brand', type: 'text' },
        { code: 'model', label: 'Model', type: 'text' },
        { code: 'warranty_years', label: 'Warranty (years)', type: 'number' },
      ],
    }),
  ];
}
