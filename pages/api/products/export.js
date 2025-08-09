const { getProducts } = require('../../../lib/products');
const { productsToCsv } = require('../../../lib/exportCsv');
const isInStock = require('../../../lib/isInStock');

module.exports = async function handler(req, res) {
  try {
    const { search, inStock } = req.query || {};
    let products = await getProducts({ search });

    const inStockOnly = inStock === '1' || inStock === 'true' || inStock === 1 || inStock === true;
    if (inStockOnly) {
      products = products.filter((p) => isInStock(p));
    }

    const csv = productsToCsv(products);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    res.status(200).send(csv);
  } catch (e) {
    res.status(500).json({ error: 'Failed to export products' });
  }
};
