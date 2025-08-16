const express = require('express');
const router = express.Router();
const { searchProducts } = require('../services/productService');

function escapeCsv(value) {
  if (value == null) return '';
  const s = String(value);
  // Quote and double-up quotes if needed
  if (/[",\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

router.get('/admin/products/export', async (req, res) => {
  try {
    const { search, tags, inStock, page, perPage } = req.query || {};

    const parsedTags = typeof tags === 'string' && tags.trim() !== ''
      ? tags.split(',').map(t => t.trim()).filter(Boolean)
      : undefined;

    const parsedInStock = inStock === 'true' ? true : (inStock === 'false' ? false : undefined);

    const filters = {
      search: typeof search === 'string' ? search : undefined,
      tags: parsedTags,
      inStock: parsedInStock,
    };

    const pagination = {
      page: page ? parseInt(page, 10) : undefined,
      perPage: perPage ? parseInt(perPage, 10) : undefined,
    };

    const products = await searchProducts(filters, pagination);

    // CSV header + rows
    const header = ['id', 'name', 'price', 'stock', 'tags'];
    const rows = products.map(p => {
      const cols = [
        escapeCsv(p.id),
        escapeCsv(p.name),
        escapeCsv(p.price),
        escapeCsv(p.stock),
        escapeCsv((p.tags || []).join('|')),
      ];
      return cols.join(',');
    });

    const csv = [header.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    res.status(200).send(csv);
  } catch (err) {
    // Keep error surface small for endpoint; tests rely on 200 for happy paths
    res.status(500).json({ error: 'Failed to export products' });
  }
});

module.exports = router;
