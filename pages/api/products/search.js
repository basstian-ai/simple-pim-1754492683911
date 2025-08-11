'use strict';

const { getProducts } = require('../../../lib/products');

function parseBool(v) {
  if (v === true || v === false) return !!v;
  if (v == null) return false;
  const s = String(v).toLowerCase();
  return s === '1' || s === 'true' || s === 'yes' || s === 'on';
}

function parseTags(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(String).map((t) => t.trim()).filter(Boolean);
  return String(input)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

function productInStock(p) {
  try {
    if (typeof p.inStock === 'boolean') return p.inStock;
    if (typeof p.stock === 'number') return p.stock > 0;
    if (Array.isArray(p.variants)) {
      for (const v of p.variants) {
        if (v && (v.inStock === true)) return true;
        const qty = typeof v?.stock === 'number' ? v.stock : (typeof v?.inventory === 'number' ? v.inventory : 0);
        if (qty > 0) return true;
      }
      return false;
    }
  } catch (_) {}
  return false;
}

function matchesQuery(p, q) {
  if (!q) return true;
  const s = String(q).toLowerCase();
  const fields = [p.name, p.sku, p.slug, p.description];
  for (const f of fields) {
    if (typeof f === 'string' && f.toLowerCase().includes(s)) return true;
  }
  // also check tags
  if (Array.isArray(p.tags) && p.tags.some((t) => String(t).toLowerCase().includes(s))) return true;
  return false;
}

function hasAllTags(p, required) {
  if (!required.length) return true;
  const tags = new Set((Array.isArray(p.tags) ? p.tags : []).map((t) => String(t)));
  for (const t of required) {
    if (!tags.has(t)) return false;
  }
  return true;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { q, tags, inStock, limit, offset } = req.query || {};

    const wantInStock = parseBool(inStock);
    const requiredTags = parseTags(tags);
    const lim = Math.max(0, Math.min(1000, parseInt(limit, 10) || 50));
    const off = Math.max(0, parseInt(offset, 10) || 0);

    const all = (await getProducts()) || [];

    const filtered = all.filter((p) => {
      if (!matchesQuery(p, q)) return false;
      if (wantInStock && !productInStock(p)) return false;
      if (!hasAllTags(p, requiredTags)) return false;
      return true;
    });

    const items = filtered.slice(off, off + lim);

    return res.status(200).json({ count: filtered.length, limit: lim, offset: off, items });
  } catch (err) {
    console.error('products/search error', err);
    return res.status(500).json({ error: 'Search failed' });
  }
};
