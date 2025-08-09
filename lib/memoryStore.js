let nextId = 2;

const attributeGroups = [
  {
    id: 'grp_1',
    name: 'Default Attributes',
    attributes: [
      // Example attribute placeholder; your app can extend this.
      // { code: 'title', label: 'Title', type: 'text' }
    ],
  },
];

export function getGroups() {
  // Return a shallow copy to avoid accidental external mutation
  return attributeGroups.map((g) => ({ ...g, attributes: [...g.attributes] }));
}

export function getGroup(id) {
  const group = attributeGroups.find((g) => g.id === id);
  if (!group) return null;
  return { ...group, attributes: [...group.attributes] };
}

export function createGroup({ name }) {
  const id = `grp_${nextId++}`;
  const group = { id, name: String(name || '').trim(), attributes: [] };
  attributeGroups.push(group);
  return { ...group, attributes: [...group.attributes] };
}

export function updateGroup(id, patch = {}) {
  const idx = attributeGroups.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  const current = attributeGroups[idx];
  const updated = {
    ...current,
    ...(patch.name !== undefined ? { name: String(patch.name).trim() } : {}),
    ...(Array.isArray(patch.attributes) ? { attributes: patch.attributes } : {}),
  };
  attributeGroups[idx] = updated;
  return { ...updated, attributes: [...updated.attributes] };
}

export function deleteGroup(id) {
  const idx = attributeGroups.findIndex((g) => g.id === id);
  if (idx === -1) return false;
  attributeGroups.splice(idx, 1);
  return true;
}
