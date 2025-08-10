const products = require('../../data/products.json');

function sendJson(res, status, payload) {
  if (typeof res.status === 'function') {
    return res.status(status).json(payload);
  }
  // Fallback for simple mock res objects in tests
  res.statusCode = status;
  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json');
  }
  res._json = payload; // for tests
  if (typeof res.end === 'function') {
    res.end(JSON.stringify(payload));
  }
  return res;
}

module.exports = async function productBySkuHandler(req, res) {
  const { method } = req;
  if (method !== 'GET') {
    if (typeof res.setHeader === 'function') {
      res.setHeader('Allow', 'GET');
    }
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }

  const { sku } = req.query || {};
  if (!sku) {
    return sendJson(res, 400, { error: 'Missing sku' });
  }

  const lookup = Array.isArray(sku) ? sku[0] : sku;
  const found = products.find(
    (p) => String(p.sku).toLowerCase() === String(lookup).toLowerCase()
  );

  if (!found) {
    return sendJson(res, 404, { error: 'Product not found' });
  }

  return sendJson(res, 200, found);
};
