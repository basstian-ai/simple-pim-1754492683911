/*
 Helper to build a products export URL including current filters.
 Returns a path like: /api/products/export?search=...&tags=a,b&inStock=1
 Accepts tags as either an array of strings or a single comma-separated string.
*/

function buildProductsExportUrl(filters = {}) {
  const { search, tags, inStock } = filters || {};
  const params = [];

  if (typeof search === 'string' && search.trim() !== '') {
    params.push(`search=${encodeURIComponent(search)}`);
  }

  if (Array.isArray(tags) && tags.length > 0) {
    // encode each tag and join with commas
    params.push(`tags=${tags.map((t) => encodeURIComponent(t)).join(',')}`);
  } else if (typeof tags === 'string' && tags.trim() !== '') {
    // tags may be a single comma-separated string
    params.push(`tags=${tags.split(',').map((t) => encodeURIComponent(t.trim())).join(',')}`);
  }

  if (inStock === true || inStock === '1' || inStock === 1) {
    params.push('inStock=1');
  }

  return params.length > 0 ? `/api/products/export?${params.join('&')}` : '/api/products/export';
}

module.exports = buildProductsExportUrl;
