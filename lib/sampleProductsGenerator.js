/*
 Rich sample product generator for the PIM.
 Produces deterministic products with attributes and optional variants so the UI
 and tests can exercise attribute/variant related behavior.
*/

const COLORS = ['Red', 'Blue', 'Green', 'Black', 'White'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const MATERIALS = ['Cotton', 'Polyester', 'Wool'];
const TAGS = ['new', 'sale', 'popular', 'limited', 'clearance'];
const ADJECTIVES = ['Classic', 'Modern', 'Vintage', 'Minimal', 'Sport'];
const NOUNS = ['T-Shirt', 'Sneakers', 'Jacket', 'Backpack', 'Hat'];

function pick(arr, i) {
  return arr[i % arr.length];
}

function deterministicPrice(i) {
  // Return a price that varies but is deterministic
  return Number((9.99 + (i % 50) * 1.25).toFixed(2));
}

function makeBaseProduct(i) {
  const sku = `SKU${1000 + i}`;
  const name = `${pick(ADJECTIVES, i)} ${pick(NOUNS, i)}`;
  const description = `A ${name} with great quality and design.`;
  const tags = [pick(TAGS, i), pick(TAGS, i + 1)].filter((v, idx, arr) => arr.indexOf(v) === idx);
  const price = deterministicPrice(i);
  const inStock = i % 3 !== 0;

  const attributes = {
    color: pick(COLORS, i),
    size: pick(SIZES, i + 1),
    material: pick(MATERIALS, i + 2),
  };

  const images = [
    `https://via.placeholder.com/320x320.png?text=${encodeURIComponent(name)}`,
  ];

  return {
    sku,
    name,
    description,
    tags,
    price,
    inStock,
    attributes,
    images,
  };
}

function makeVariantsFor(base, count, startIndex) {
  const variants = [];
  for (let j = 0; j < count; j++) {
    const vIndex = startIndex + j;
    // tweak attributes slightly per variant
    const attributes = {
      ...base.attributes,
      color: pick(COLORS, vIndex + 1),
      size: pick(SIZES, vIndex + 2),
    };
    const sku = `${base.sku}-V${j + 1}`;
    const name = `${base.name} — Variant ${j + 1}`;
    const price = Number((base.price + (j * 0.5)).toFixed(2));
    const inStock = (vIndex % 2) === 0;
    variants.push({ sku, name, attributes, price, inStock, images: base.images });
  }
  return variants;
}

export default function generateSampleProducts(count = 50) {
  const products = [];
  let globalVariantCounter = 0;
  for (let i = 0; i < count; i++) {
    const base = makeBaseProduct(i);

    // For about 1/4 of products, generate variants (2-4 variants)
    let variants = [];
    if (i % 4 === 0) {
      const vc = 2 + (i % 3); // 2-4 variants
      variants = makeVariantsFor(base, vc, globalVariantCounter);
      globalVariantCounter += vc;
    }

    products.push({ ...base, variants });
  }
  return products;
}
