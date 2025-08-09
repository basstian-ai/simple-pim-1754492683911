/*
 In-memory store for Attribute Groups.
 This is ephemeral (resets on server cold start), suitable for demo/dev.
*/

const groups = [];
let seq = 0;

function seedOnce() {
  if (groups.length > 0) return;
  groups.push({
    id: genId(),
    code: 'basic',
    name: 'Basic Attributes',
    attributes: [
      { code: 'name', label: 'Name', type: 'text' },
      { code: 'sku', label: 'SKU', type: 'text' }
    ],
    createdAt: new Date().toISOString()
  });
}

function genId() {
  seq += 1;
  return `grp_${Date.now().toString(36)}_${seq}`;
}

function listGroups() {
  seedOnce();
  // return a shallow copy to avoid accidental external mutation
  return groups.map((g) => ({ ...g, attributes: g.attributes.map((a) => ({ ...a })) }));
}

function createGroup(input) {
  seedOnce();
  const { code, name, attributes } = input || {};
  if (!code || typeof code !== 'string') {
    const err = new Error('code is required');
    err.statusCode = 400;
    throw err;
  }
  if (!name || typeof name !== 'string') {
    const err = new Error('name is required');
    err.statusCode = 400;
    throw err;
  }
  const exists = groups.find((g) => g.code.toLowerCase() === code.toLowerCase());
  if (exists) {
    const err = new Error(`attribute group with code "${code}" already exists`);
    err.statusCode = 409;
    throw err;
  }
  const group = {
    id: genId(),
    code,
    name,
    attributes: Array.isArray(attributes) ? attributes.map((a) => ({ ...a })) : [],
    createdAt: new Date().toISOString()
  };
  groups.push(group);
  return { ...group, attributes: group.attributes.map((a) => ({ ...a })) };
}

module.exports = {
  listGroups,
  createGroup
};
