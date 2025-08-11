// Utility helpers for filtering product arrays by search term, tags and stock.
// This module exports a default function `filterProducts` and a named helper
// `filterByTags`.  It operates on plain JavaScript objects so it can be reused
// both in the API handlers and in tests.

// Return a copy of `products` that include every tag in `tags`.
function filterByTags(products, tags) {
  if (!Array.isArray(products)) return [];
  const tagList = Array.isArray(tags) ? tags.filter(Boolean) : [];
  if (tagList.length === 0) return products.slice();
  return products.filter(
    (p) => Array.isArray(p?.tags) && tagList.every((t) => p.tags.includes(t))
  );
}

function matchesSearch(product, query) {
  if (!query) return true;
  const haystack = [
    product.name,
    product.slug,
    product.sku,
    product.description,
  ]
    .filter(Boolean)
    .map((v) => v.toString().toLowerCase())
    .join(' ');
  return haystack.includes(query);
}

function hasStock(product) {
  if (typeof product.inStock === 'boolean') return product.inStock;
  if (typeof product.stock === 'number') return product.stock > 0;
  if (typeof product.quantity === 'number') return product.quantity > 0;
  if (Array.isArray(product.variants)) {
    return product.variants.some((v) => {
      if (typeof v.inStock === 'boolean') return v.inStock;
      if (typeof v.stock === 'number') return v.stock > 0;
      if (typeof v.quantity === 'number') return v.quantity > 0;
      return false;
    });
  }
  return false;
}

// Main filtering function used by the API. Accepts an array of products and
// an options object `{ search, tags, inStock }`.
function filterProducts(products, options = {}) {
  if (!Array.isArray(products)) return [];
  const { search = '', tags = [], inStock = false } = options;

  let result = products.slice();

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter((p) => matchesSearch(p, q));
  }

  if (Array.isArray(tags) && tags.length > 0) {
    result = filterByTags(result, tags);
  }

  if (inStock) {
    result = result.filter(hasStock);
  }

  return result;
}

module.exports = filterProducts;
module.exports.filterByTags = filterByTags;

