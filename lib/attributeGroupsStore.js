/*
  In-memory Attribute Groups store for the Simple PIM.
  Note: This is ephemeral and resets per serverless instance. Suitable for demo/dev.
*/

function uuid() {
  return (
    Date.now().toString(36) +
    '-' + Math.random().toString(36).slice(2, 8) +
    '-' + Math.random().toString(36).slice(2, 8)
  );
}

function ensureAttrId(attr) {
  if (!attr) return null;
  const { code, label, type } = attr;
  if (!code || !label) return null;
  return {
    id: attr.id || `attr_${uuid()}`,
    code: String(code),
    label: String(label),
    type: String(type || 'text'),
  };
}

function getStore() {
  if (!global.__ATTRIBUTE_GROUPS_STORE__) {
    const initial = [
      {
        id: 'grp_basic',
        name: 'Basic',
        attributes: [
          { id: 'attr_name', code: 'name', label: 'Name', type: 'text' },
          { id: 'attr_sku', code: 'sku', label: 'SKU', type: 'text' },
          { id: 'attr_desc', code: 'description', label: 'Description', type: 'text' },
        ],
      },
      {
        id: 'grp_seo',
        name: 'SEO',
        attributes: [
          { id: 'attr_slug', code: 'slug', label: 'Slug', type: 'text' },
          { id: 'attr_meta_title', code: 'meta_title', label: 'Meta Title', type: 'text' },
          { id: 'attr_meta_desc', code: 'meta_description', label: 'Meta Description', type: 'text' },
        ],
      },
    ];
    global.__ATTRIBUTE_GROUPS_STORE__ = {
      groups: initial,
    };
  }
  return global.__ATTRIBUTE_GROUPS_STORE__;
}

function list() {
  return [...getStore().groups];
}

function get(id) {
  return getStore().groups.find((g) => g.id === id) || null;
}

function create({ name, attributes }) {
  const store = getStore();
  const id = `grp_${uuid()}`;
  const attrs = Array.isArray(attributes)
    ? attributes
        .map(ensureAttrId)
        .filter(Boolean)
    : [];
  const group = { id, name: String(name || 'Untitled Group'), attributes: attrs };
  store.groups = [...store.groups, group];
  return group;
}

function update(id, data) {
  const store = getStore();
  const idx = store.groups.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  const current = store.groups[idx];
  let next = { ...current };
  if (typeof data.name === 'string' && data.name.trim().length > 0) {
    next.name = data.name;
  }
  if (Array.isArray(data.attributes)) {
    next.attributes = data.attributes.map(ensureAttrId).filter(Boolean);
  }
  store.groups = [
    ...store.groups.slice(0, idx),
    next,
    ...store.groups.slice(idx + 1),
  ];
  return next;
}

function remove(id) {
  const store = getStore();
  const before = store.groups.length;
  store.groups = store.groups.filter((g) => g.id !== id);
  return store.groups.length < before;
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};
