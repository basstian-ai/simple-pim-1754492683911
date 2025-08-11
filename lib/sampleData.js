/*
  Sample catalog data with attribute groups and basic variant fields.
  CommonJS exports so it can be used by Next.js pages and Node-based tests.
*/

const attributeGroups = [
  {
    code: "basics",
    name: "Basics",
    attributes: [
      {
        code: "color",
        name: "Color",
        type: "select",
        options: [
          { code: "red", label: "Red" },
          { code: "blue", label: "Blue" },
          { code: "green", label: "Green" }
        ]
      },
      {
        code: "size",
        name: "Size",
        type: "select",
        options: [
          { code: "s", label: "Small" },
          { code: "m", label: "Medium" },
          { code: "l", label: "Large" }
        ]
      }
    ]
  },
  {
    code: "materials",
    name: "Materials",
    attributes: [
      {
        code: "material",
        name: "Material",
        type: "select",
        options: [
          { code: "cotton", label: "Cotton" },
          { code: "wool", label: "Wool" },
          { code: "poly", label: "Polyester" }
        ]
      }
    ]
  }
];

const products = [
  {
    id: "p-shirt-classic",
    slug: "classic-tee",
    name: "Classic Tee",
    description: "A timeless classic tee with multiple colors and sizes.",
    images: [
      "/images/products/classic-tee-red.jpg",
      "/images/products/classic-tee-blue.jpg"
    ],
    currency: "USD",
    price: 1999,
    attributes: { material: "cotton" },
    variants: [
      { id: "p-shirt-classic-red-s", sku: "CT-RED-S", price: 1999, stock: 25, options: { color: "red", size: "s" } },
      { id: "p-shirt-classic-red-m", sku: "CT-RED-M", price: 1999, stock: 30, options: { color: "red", size: "m" } },
      { id: "p-shirt-classic-blue-m", sku: "CT-BLU-M", price: 1999, stock: 12, options: { color: "blue", size: "m" } },
      { id: "p-shirt-classic-green-l", sku: "CT-GRN-L", price: 1999, stock: 5, options: { color: "green", size: "l" } }
    ]
  },
  {
    id: "p-hoodie-premium",
    slug: "premium-hoodie",
    name: "Premium Hoodie",
    description: "Cozy premium hoodie with soft-touch materials.",
    images: [
      "/images/products/premium-hoodie-black.jpg"
    ],
    currency: "USD",
    price: 4999,
    attributes: { material: "wool" },
    variants: [
      { id: "p-hoodie-premium-red-m", sku: "PH-RED-M", price: 4999, stock: 8, options: { color: "red", size: "m" } },
      { id: "p-hoodie-premium-blue-l", sku: "PH-BLU-L", price: 4999, stock: 0, options: { color: "blue", size: "l" } },
      { id: "p-hoodie-premium-green-m", sku: "PH-GRN-M", price: 4999, stock: 3, options: { color: "green", size: "m" } }
    ]
  },
  {
    id: "p-joggers-lite",
    slug: "lite-joggers",
    name: "Lite Joggers",
    description: "Breathable joggers for everyday comfort.",
    images: [
      "/images/products/lite-joggers-gray.jpg"
    ],
    currency: "USD",
    price: 3999,
    attributes: { material: "poly" },
    variants: [
      { id: "p-joggers-lite-blue-s", sku: "LJ-BLU-S", price: 3999, stock: 40, options: { color: "blue", size: "s" } },
      { id: "p-joggers-lite-blue-m", sku: "LJ-BLU-M", price: 3999, stock: 22, options: { color: "blue", size: "m" } },
      { id: "p-joggers-lite-blue-l", sku: "LJ-BLU-L", price: 3999, stock: 10, options: { color: "blue", size: "l" } }
    ]
  }
];

function getSampleAttributes() {
  return JSON.parse(JSON.stringify(attributeGroups));
}

function getSampleProducts() {
  return JSON.parse(JSON.stringify(products));
}

function getSampleCatalog() {
  return { attributes: getSampleAttributes(), products: getSampleProducts() };
}

module.exports = { getSampleAttributes, getSampleProducts, getSampleCatalog };
