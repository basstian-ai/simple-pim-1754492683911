'use strict';

const { applyBulkTags } = require('../../../../lib/bulkTags');
const { getProducts } = require('../../../../lib/products');

function parseSkuList(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((s) => String(s).trim()).filter(Boolean);
  // split by newline, comma or whitespace
  return String(input)
    .split(/[^A-Za-z0-9_\-\.]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const body = req.body || {};
    const skus = parseSkuList(body.skus || body.skuList || body.sku);
    const add = Array.isArray(body.add) ? body.add : (body.add ? [body.add] : []);
    const remove = Array.isArray(body.remove) ? body.remove : (body.remove ? [body.remove] : []);

    if (!skus.length) {
      return res.status(400).json({ error: 'Provide at least one SKU in skus[] or a string list.' });
    }

    const products = (await getProducts()) || [];
    const { items, stats } = applyBulkTags(products, { skus, add, remove });

    return res.status(200).json({ count: items.length, items, stats });
  } catch (err) {
    console.error('bulk-preview error', err);
    return res.status(500).json({ error: 'Bulk tag preview failed' });
  }
};
