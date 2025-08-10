function toArray(v) {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

function normalizeAttributes(input) {
  // Accept: string (comma/semicolon/newline separated), array of strings, or array of {name}
  const parts = [];
  for (const v of toArray(input)) {
    if (typeof v === 'string') {
      const split = v.split(/[;,\n]/g).map((s) => s.trim()).filter(Boolean);
      parts.push(...split);
    } else if (v && typeof v === 'object') {
      if (typeof v.name === 'string' && v.name.trim()) parts.push(v.name.trim());
    }
  }

  const seen = new Set();
  const out = [];
  for (const name of parts) {
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ name });
  }
  return out;
}

function validateAttributeGroup(group, existing = []) {
  const errs = [];
  const name = (group && group.name ? String(group.name) : '').trim();
  if (!name) errs.push('Group name is required');

  const attrs = Array.isArray(group && group.attributes) ? group.attributes : [];
  if (attrs.length === 0) errs.push('At least one attribute is required');

  // Uniqueness across existing (case-insensitive)
  const lower = name.toLowerCase();
  const conflict = existing.find((g) => (g.name || '').toLowerCase() === lower);
  if (name && conflict) errs.push('A group with this name already exists');

  // Ensure attribute names are unique after normalization
  const names = attrs.map((a) => (a.name || '').trim()).filter(Boolean);
  const uniq = new Set(names.map((n) => n.toLowerCase()));
  if (names.length !== uniq.size) errs.push('Attribute names must be unique');

  return errs;
}

function upsertGroup(groups, group) {
  const list = Array.isArray(groups) ? groups.slice() : [];
  const idx = list.findIndex((g) => g.id === group.id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...group };
  } else {
    list.unshift(group);
  }
  return list;
}

module.exports = {
  normalizeAttributes,
  validateAttributeGroup,
  upsertGroup,
};
