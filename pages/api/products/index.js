const { getProducts, addProduct } = require('../../../lib/store');

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
  const { method } = req;

  if (method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return send(res, 204, {});
  }

  if (method === 'GET') {
    const items = getProducts();
    return send(res, 200, { items, count: items.length });
  }

  if (method === 'POST') {
    const body = req.body || {};
    const name = (body.name || '').trim();
    const sku = (body.sku || '').trim();
    const price = Number(body.price);

    const errors = [];
    if (!name) errors.push({ field: 'name', message: 'Name is required' });
    if (!sku) errors.push({ field: 'sku', message: 'SKU is required' });
    if (!Number.isFinite(price) || price < 0) errors.push({ field: 'price', message: 'Price must be a non-negative number' });

    if (errors.length) {
      return send(res, 400, { errors });
    }

    const created = addProduct({
      name,
      sku,
      price,
      currency: body.currency || 'USD',
      description: body.description || '',
      images: Array.isArray(body.images) ? body.images : [],
      categories: Array.isArray(body.categories) ? body.categories : [],
      attributes: body.attributes || {},
      variants: Array.isArray(body.variants) ? body.variants : [],
      brand: body.brand || 'SimplePIM',
      status: body.status || 'active',
    });

    return send(res, 201, created);
  }

  res.setHeader('Allow', 'GET,POST,OPTIONS');
  return send(res, 405, { error: 'Method not allowed' });
};
