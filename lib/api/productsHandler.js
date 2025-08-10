const products = require('../../data/products.json');
const filterProducts = require('../filterProducts');

function parseBool(val) {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') return ['1', 'true', 'yes', 'on'].includes(val.toLowerCase());
  return false;
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { search = '', tags = '', inStock = '' } = req.query || {};
  const tagList = typeof tags === 'string' && tags.length > 0 ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
  const onlyInStock = parseBool(inStock);

  const result = filterProducts(products, { search, tags: tagList, inStock: onlyInStock });
  res.status(200).json(result);
}
