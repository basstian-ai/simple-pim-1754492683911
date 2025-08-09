const DEFAULT_GROUPS = [
  {
    id: 'basic',
    name: 'Basic',
    attributes: [
      { code: 'name', label: 'Name' },
      { code: 'sku', label: 'SKU' }
    ]
  },
  {
    id: 'pricing',
    name: 'Pricing',
    attributes: [
      { code: 'price', label: 'Price' },
      { code: 'currency', label: 'Currency' }
    ]
  },
  {
    id: 'seo',
    name: 'SEO',
    attributes: [
      { code: 'metaTitle', label: 'Meta Title' },
      { code: 'metaDescription', label: 'Meta Description' }
    ]
  }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ groups: DEFAULT_GROUPS });
    return;
  }
  res.setHeader('Allow', ['GET']);
  res.status(405).json({ error: 'Method Not Allowed' });
}
