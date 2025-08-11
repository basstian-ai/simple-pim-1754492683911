const { attributeGroups: initialGroups } = require('./sampleData');

let groups = JSON.parse(JSON.stringify(initialGroups));

function uid(prefix = 'id') {
  const rnd = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}_${rnd}`;
}

function slugify(str) {
  return String(str || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function getAttributeGroups() {
  return groups;
}

function addGroup(name) {
  const trimmed = String(name || '').trim();
  if (!trimmed) throw new Error('Group name is required');
  const g = { id: uid('grp'), name: trimmed, attributes: [] };
  groups = [...groups, g];
  return g;
}

function addAttribute(groupId, attr) {
  const gIdx = groups.findIndex((g) => g.id === groupId);
  if (gIdx === -1) throw new Error('Group not found');
  const base = attr || {};
  const code = base.code && String(base.code).trim() ? slugify(base.code) : slugify(base.name || 'attribute');
  const newAttr = {
    id: uid('attr'),
    code,
    name: String(base.name || code),
    type: String(base.type || 'text')
  };
  const next = [...groups];
  next[gIdx] = { ...next[gIdx], attributes: [...next[gIdx].attributes, newAttr] };
  groups = next;
  return newAttr;
}

function reset(newGroups) {
  groups = JSON.parse(JSON.stringify(newGroups || initialGroups));
}

module.exports = {
  getAttributeGroups,
  addGroup,
  addAttribute,
  reset
};
