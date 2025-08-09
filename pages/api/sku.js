'use strict';

const { generateSku } = require('../../lib/sku');

module.exports = (req, res) => {
  const method = req.method || 'GET';
  const source = method === 'POST' ? (req.body || {}) : (req.query || {});
  const name = typeof source.name === 'string' ? source.name : '';
  const prefix = typeof source.prefix === 'string' ? source.prefix : undefined;

  if (!name) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'name is required' }));
    return;
  }

  const sku = generateSku(name, { prefix });

  res.statusCode = 200;
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ sku }));
};