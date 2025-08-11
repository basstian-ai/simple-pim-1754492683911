import slugify from './slugify';

// Add deterministic placeholder image URLs to products.
// Uses product.sku (preferred) or a slugified product name as the seed so the
// same product always gets the same image URL. If the product already has
// an image property, it is left untouched.
export function addImagesToProducts(products = []) {
  if (!Array.isArray(products)) return [];

  return products.map((p) => {
    if (!p || typeof p !== 'object') return p;
    if (p.image) return p;

    const seed = (p.sku && String(p.sku)) || slugify(p.name || '') || 'product';
    // Use picsum.photos with a deterministic seed per product.
    // The encoded seed ensures safe characters in the URL.
    const image = `https://picsum.photos/seed/${encodeURIComponent(seed)}/200/200`;
    return { ...p, image };
  });
}

export default addImagesToProducts;
