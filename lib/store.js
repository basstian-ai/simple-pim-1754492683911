const fs = require('fs');
const path = require('path');

function loadInitialProducts() {
  try {
    const file = path.join(process.cwd(), 'data', 'products.json');
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    return [];
  }
}

function initStore() {
  if (!global.__PIM_STORE__) {
    global.__PIM_STORE__ = {
      products: loadInitialProducts(),
    };
  }
  return global.__PIM_STORE__;
}

function genId() {
  return 'prd_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function normalizeProduct(input) {
  const now = new Date().toISOString();
  return {
    id: input.id || genId(),
    name: String(input.name || '').trim(),
    slug: input.slug || (String(input.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')),
    sku: String(input.sku || '').trim(),
    price: Number(input.price || 0),
    currency: input.currency || 'USD',
    status: input.status || 'active',
    description: input.description || '',
    images: Array.isArray(input.images) ? input.images : [],
    categories: Array.isArray(input.categories) ? input.categories : [],
    brand: input.brand || 'SimplePIM',
    attributes: input.attributes || {},
    variants: Array.isArray(input.variants) ? input.variants : [],
    createdAt: input.createdAt || now,
    updatedAt: now,
  };
}

module.exports = {
  getProducts() {
    const store = initStore();
    return store.products;
  },
  addProduct(partial) {
    const store = initStore();
    const p = normalizeProduct(partial);
    store.products.unshift(p);
    return p;
  },
};
