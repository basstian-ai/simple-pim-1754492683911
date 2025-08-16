let PRODUCTS = [];

function setProducts(arr) {
  PRODUCTS = Array.isArray(arr) ? arr.slice() : [];
}

/**
 * Search products in-memory using simple filters and pagination.
 * Filters supported: search (substring against name & tags), tags (array -> any match), inStock (boolean)
 * Pagination: page (1-based), perPage
 */
async function searchProducts(filters = {}, pagination = {}) {
  const { search, tags, inStock } = filters || {};
  const page = Math.max(1, Number.isFinite(+pagination.page) ? +pagination.page : (pagination.page || 1));
  const perPage = Math.max(1, Number.isFinite(+pagination.perPage) ? +pagination.perPage : (pagination.perPage || 1000));

  let results = PRODUCTS.slice();

  if (typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase();
    results = results.filter(p => {
      const name = String(p.name || '').toLowerCase();
      const tagsList = (p.tags || []).join(' ').toLowerCase();
      return name.includes(q) || tagsList.includes(q) || String(p.id || '').toLowerCase().includes(q);
    });
  }

  if (Array.isArray(tags) && tags.length > 0) {
    const wanted = tags.map(t => String(t || '').toLowerCase()).filter(Boolean);
    if (wanted.length > 0) {
      // match any of the provided tags
      results = results.filter(p => {
        const itemTags = (p.tags || []).map(t => String(t).toLowerCase());
        return itemTags.some(t => wanted.includes(t));
      });
    }
  }

  if (typeof inStock === 'boolean') {
    if (inStock) {
      results = results.filter(p => Number(p.stock || 0) > 0);
    } else {
      results = results.filter(p => Number(p.stock || 0) <= 0);
    }
  }

  const start = (page - 1) * perPage;
  const end = start + perPage;
  return results.slice(start, end);
}

module.exports = {
  searchProducts,
  setProducts,
};
