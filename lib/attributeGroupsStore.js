let groups = [
  {
    id: 'core',
    name: 'Core',
    description: 'Core product attributes',
    attributes: []
  }
];

function slugify(input) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function ensureUniqueId(baseId) {
  let id = baseId;
  let i = 1;
  while (groups.some(g => g.id === id)) {
    id = `${baseId}-${i++}`;
  }
  return id;
}

function listGroups() {
  // Return a shallow copy to avoid external mutation
  return groups.map(g => ({ ...g }));
}

function getGroup(id) {
  return groups.find(g => g.id === id) || null;
}

function addGroup(input) {
  const name = (input && input.name ? String(input.name) : '').trim();
  const description = (input && input.description ? String(input.description) : '').trim();
  if (!name) {
    const err = new Error('name is required');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  const baseId = slugify(name) || 'group';
  const id = ensureUniqueId(baseId);
  const group = { id, name, description, attributes: [] };
  groups.push(group);
  return { ...group };
}

function _reset() {
  groups = [];
}

module.exports = {
  listGroups,
  getGroup,
  addGroup,
  _reset
};
