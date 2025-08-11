/*
 * Generate realistic-looking sample products for admin / demo use.
 * This module is intentionally standalone to avoid touching existing sample-data
 * files and to provide a lightweight, testable generator used by admin UIs.
 */

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function slugifyName(name) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') ||
    Math.random().toString(36).slice(2, 8)
  ).toUpperCase();
}

function generateBaseName() {
  const adjectives = [
    'Classic',
    'Modern',
    'Portable',
    'Premium',
    'Compact',
    'Deluxe',
    'Eco',
    'Smart',
    'Elite',
  ];
  const nouns = [
    'Speaker',
    'Mug',
    'Backpack',
    'Chair',
    'Headphones',
    'Lamp',
    'Watch',
    'Bottle',
    'Camera',
  ];
  return `${randomChoice(adjectives)} ${randomChoice(nouns)}`;
}

function formatPrice(cents) {
  return Number((cents / 100).toFixed(2));
}

function generateSkuFromName(name, idx) {
  const base = slugifyName(name).slice(0, 10);
  const suffix = String(idx + 1).padStart(3, '0');
  // Add a short random part for better uniqueness across runs
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${base}-${suffix}-${rand}`;
}

function sampleTags() {
  const pool = ['new', 'sale', 'popular', 'eco', 'limited', 'home', 'office', 'outdoor'];
  const count = randomInt(0, 3);
  const selected = new Set();
  while (selected.size < count) selected.add(randomChoice(pool));
  return Array.from(selected);
}

function sampleAttributes() {
  const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow'];
  const sizes = ['S', 'M', 'L', 'XL'];
  return {
    color: randomChoice(colors),
    size: randomChoice(sizes),
  };
}

function generateSampleProducts(count = 10) {
  if (typeof count !== 'number' || count < 1) count = 10;
  const products = [];

  for (let i = 0; i < count; i++) {
    const name = generateBaseName();
    const sku = generateSkuFromName(name, i);
    const priceCents = randomInt(999, 19999); // $9.99 - $199.99

    const product = {
      sku,
      name,
      description: `${name} — a well-crafted product suitable for everyday use.`,
      price: formatPrice(priceCents),
      currency: 'USD',
      tags: sampleTags(),
      inStock: Math.random() > 0.15,
      images: [
        // Use picsum.photos with a stable seed based on sku so same run gets same image
        `https://picsum.photos/seed/${encodeURIComponent(sku)}/640/480`,
      ],
      attributes: sampleAttributes(),
      variants: [],
    };

    // Add 0-3 variants based on attributes (size/color combos)
    const variantsCount = randomInt(0, 3);
    for (let v = 0; v < variantsCount; v++) {
      const variantSku = `${sku}-V${String(v + 1).padStart(2, '0')}`;
      product.variants.push({
        sku: variantSku,
        name: `${name} — Variant ${v + 1}`,
        price: formatPrice(priceCents + randomInt(-200, 1500)),
        attributes: {
          color: randomChoice(['Red', 'Blue', 'Black', 'White']),
          size: randomChoice(['S', 'M', 'L', 'XL']),
        },
        inStock: Math.random() > 0.25,
      });
    }

    products.push(product);
  }

  return products;
}

module.exports = { generateSampleProducts };
