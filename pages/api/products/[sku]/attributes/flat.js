import slugify from '../../../../../lib/slugify';
import sampleProducts from '../../../../../lib/sampleProducts';

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { sku } = req.query || {};
  if (!sku || typeof sku !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid sku parameter' });
  }

  try {
    const products = Array.isArray(sampleProducts) ? sampleProducts : [];
    const product = products.find((p) => p && p.sku === sku);

    if (!product) {
      return res.status(404).json({ error: 'Product not found', sku });
    }

    const attributeGroups = Array.isArray(product.attributeGroups) ? product.attributeGroups : [];

    const attributes = [];
    for (const g of attributeGroups) {
      const groupName = g?.name || g?.id || 'General';
      const groupId = g?.id || slugify(groupName);
      const attrs = Array.isArray(g?.attributes) ? g.attributes : [];
      for (const a of attrs) {
        const name = a?.name || a?.label || a?.code || '';
        const code = a?.code || (name ? slugify(name) : undefined) || '';
        const type = a?.type || 'text';
        const entry = {
          groupId,
          groupName,
          code,
          name,
          type,
        };
        if (typeof a?.required !== 'undefined') entry.required = Boolean(a.required);
        if (a?.unit) entry.unit = a.unit;
        if (Array.isArray(a?.options) && a.options.length) entry.options = a.options;
        attributes.push(entry);
      }
    }

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ sku: product.sku, count: attributes.length, attributes });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
