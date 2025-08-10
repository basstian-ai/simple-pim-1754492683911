const { suggestProducts } = require('../../../lib/productSuggest');

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { q, query, search, limit } = req.query || {};
  const term = (q || query || search || '').toString();
  const lim = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

  try {
    const products = require('../../../data/products.json');
    const suggestions = suggestProducts(term, products, lim);
    res.status(200).json(suggestions);
  } catch (e) {
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
};
