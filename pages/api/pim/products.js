const { getSampleProducts } = require('../../../lib/data/sampleProducts');

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  // Cache for edge/CDN
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  const products = getSampleProducts();
  return res.status(200).json({ products, count: products.length });
};
