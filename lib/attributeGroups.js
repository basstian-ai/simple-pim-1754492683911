const ATTRIBUTE_GROUPS = [
  {
    id: 'core',
    name: 'Core',
    description: 'Essential product fields used across the catalog.',
    attributes: ['name', 'sku', 'price']
  },
  {
    id: 'seo',
    name: 'SEO',
    description: 'Search engine optimization fields for better discoverability.',
    attributes: ['metaTitle', 'metaDescription']
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Stock and warehouse related fields.',
    attributes: ['stock', 'warehouse']
  }
];

function normalizeQuery(q) {
  return (q || '').toString().trim().toLowerCase();
}

function getAttributeGroups(q) {
  const term = normalizeQuery(q);
  if (!term) return ATTRIBUTE_GROUPS.slice();
  return ATTRIBUTE_GROUPS.filter((g) =>
    g.id.toLowerCase().includes(term) ||
    g.name.toLowerCase().includes(term) ||
    (g.description && g.description.toLowerCase().includes(term))
  );
}

module.exports = {
  ATTRIBUTE_GROUPS,
  getAttributeGroups
};
