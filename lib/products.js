'use strict';

const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(process.cwd(), 'data', 'products.json');

function readProductsFile() {
  try {
    const raw = fs.readFileSync(productsFilePath, 'utf-8');
    const json = JSON.parse(raw);
    return Array.isArray(json) ? json : [];
  } catch (e) {
    return [];
  }
}

function normalize(v) {
  return (v || '').toString().toLowerCase();
}

function filterProducts(items, search) {
  if (!search || !search.trim()) return items.slice();
  const q = normalize(search.trim());
  return items.filter((p) => {
    const haystack = [p.name, p.sku, p.description, p.category, p.brand]
      .filter(Boolean)
      .map(normalize)
      .join(' ');
    return haystack.includes(q);
  });
}

async function getProducts(options = {}) {
  let search;
  if (typeof options === 'string') {
    search = options;
  } else {
    search = options.search;
  }
  const items = readProductsFile();
  if (search) {
    return filterProducts(items, search);
  }
  return items;
}

module.exports = {
  getProducts,
  filterProducts,
  readProductsFile,
};
