const state = {
  groups: [
    {
      id: 'gen',
      name: 'General',
      attributes: [
        { id: 'brand', name: 'Brand', type: 'text' },
        { id: 'color', name: 'Color', type: 'text' },
        { id: 'material', name: 'Material', type: 'text' }
      ]
    },
    {
      id: 'dims',
      name: 'Dimensions',
      attributes: [
        { id: 'width', name: 'Width', type: 'number', unit: 'cm' },
        { id: 'height', name: 'Height', type: 'number', unit: 'cm' },
        { id: 'depth', name: 'Depth', type: 'number', unit: 'cm' }
      ]
    }
  ],
  updatedAt: Date.now()
};

function uid(prefix = 'id') {
  const rand = Math.random().toString(36).slice(2, 8);
  const t = Date.now().toString(36);
  return `${prefix}_${rand}${t}`;
}

function touch() {
  state.updatedAt = Date.now();
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getSnapshot() {
  return deepClone(state);
}

function findGroupIndex(id) {
  return state.groups.findIndex((g) => g.id === id);
}

function listGroups() {
  return deepClone(state.groups);
}

function addGroup(name) {
  if (!name || typeof name !== 'string') throw new Error('Invalid name');
  const g = { id: uid('grp'), name: name.trim(), attributes: [] };
  state.groups.push(g);
  touch();
  return deepClone(g);
}

function renameGroup(id, name) {
  const i = findGroupIndex(id);
  if (i === -1) throw new Error('Group not found');
  state.groups[i].name = String(name || '').trim();
  touch();
  return deepClone(state.groups[i]);
}

function deleteGroup(id) {
  const i = findGroupIndex(id);
  if (i === -1) throw new Error('Group not found');
  const [removed] = state.groups.splice(i, 1);
  touch();
  return deepClone(removed);
}

function addAttribute(groupId, attribute) {
  const i = findGroupIndex(groupId);
  if (i === -1) throw new Error('Group not found');
  const attr = Object.assign({ id: uid('attr'), type: 'text' }, attribute || {});
  if (!attr.name) throw new Error('Attribute name required');
  state.groups[i].attributes.push(attr);
  touch();
  return deepClone(attr);
}

function updateAttribute(groupId, attrId, patch) {
  const i = findGroupIndex(groupId);
  if (i === -1) throw new Error('Group not found');
  const j = state.groups[i].attributes.findIndex((a) => a.id === attrId);
  if (j === -1) throw new Error('Attribute not found');
  Object.assign(state.groups[i].attributes[j], patch || {});
  touch();
  return deepClone(state.groups[i].attributes[j]);
}

function deleteAttribute(groupId, attrId) {
  const i = findGroupIndex(groupId);
  if (i === -1) throw new Error('Group not found');
  const j = state.groups[i].attributes.findIndex((a) => a.id === attrId);
  if (j === -1) throw new Error('Attribute not found');
  const [removed] = state.groups[i].attributes.splice(j, 1);
  touch();
  return deepClone(removed);
}

module.exports = {
  getSnapshot,
  listGroups,
  addGroup,
  renameGroup,
  deleteGroup,
  addAttribute,
  updateAttribute,
  deleteAttribute
};
