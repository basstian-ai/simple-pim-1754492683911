/*
  Simple in-memory Attribute Groups for the PIM
  - Provides a read-only dataset and a query helper used by the API route
*/

const ATTRIBUTE_GROUPS = [
  {
    id: 'core',
    name: 'Core',
    attributes: [
      { code: 'sku', name: 'SKU', type: 'text', required: true },
      { code: 'name', name: 'Name', type: 'text', required: true },
      { code: 'description', name: 'Description', type: 'richtext', required: false }
    ]
  },
  {
    id: 'pricing',
    name: 'Pricing',
    attributes: [
      { code: 'price', name: 'Price', type: 'number', required: true },
      { code: 'currency', name: 'Currency', type: 'select', options: ['USD', 'EUR', 'GBP'], required: true }
    ]
  },
  {
    id: 'seo',
    name: 'SEO',
    attributes: [
      { code: 'meta_title', name: 'Meta title', type: 'text', required: false },
      { code: 'meta_description', name: 'Meta description', type: 'text', required: false }
    ]
  }
];

function queryAttributeGroups(opts = {}) {
  const { q, limit } = opts;
  let data = ATTRIBUTE_GROUPS.slice();

  if (q && typeof q === 'string') {
    const s = q.toLowerCase();
    data = data.filter(
      (g) =>
        g.name.toLowerCase().includes(s) ||
        g.attributes.some(
          (a) =>
            (a.name && String(a.name).toLowerCase().includes(s)) ||
            (a.code && String(a.code).toLowerCase().includes(s))
        )
    );
  }

  if (limit !== undefined) {
    const n = Number(limit);
    if (!Number.isNaN(n) && n >= 0) {
      data = data.slice(0, n);
    }
  }

  return data;
}

module.exports = { ATTRIBUTE_GROUPS, queryAttributeGroups };
