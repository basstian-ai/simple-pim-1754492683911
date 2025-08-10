export function filterByTags(products, tags) {
  if (!Array.isArray(products)) return [];
  const tagList = Array.isArray(tags) ? tags.filter(Boolean) : [];
  if (tagList.length === 0) return products;
  return products.filter((p) => Array.isArray(p?.tags) && tagList.every((t) => p.tags.includes(t)));
}
