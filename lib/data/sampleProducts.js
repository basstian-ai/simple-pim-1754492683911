const sampleProducts = [
  {
    id: 'prod_1001',
    sku: 'TSHIRT-BASIC',
    name: 'Basic T-Shirt',
    description: 'A soft, comfortable cotton t-shirt perfect for everyday wear.',
    status: 'active',
    price: 19.99,
    currency: 'USD',
    images: [
      { url: '/images/products/tshirt-basic/main.jpg', alt: 'Basic T-Shirt front' },
      { url: '/images/products/tshirt-basic/back.jpg', alt: 'Basic T-Shirt back' }
    ],
    categories: ['apparel', 'tops'],
    stock: { managed: true, available: 120, reserved: 5 },
    attributes: [
      {
        group: 'General',
        fields: [
          { code: 'brand', name: 'Brand', type: 'text', value: 'SimpleWear' },
          { code: 'material', name: 'Material', type: 'text', value: '100% Cotton' }
        ]
      },
      {
        group: 'Dimensions',
        fields: [
          { code: 'weight', name: 'Weight', type: 'number', unit: 'g', value: 180 },
          { code: 'length', name: 'Length', type: 'number', unit: 'cm', value: 70 }
        ]
      },
      {
        group: 'SEO',
        fields: [
          { code: 'meta_title', name: 'Meta Title', type: 'text', value: 'Basic T-Shirt' },
          { code: 'meta_description', name: 'Meta Description', type: 'text', value: 'Soft and comfy cotton tee in multiple colors and sizes.' }
        ]
      }
    ],
    options: [
      { code: 'color', name: 'Color', values: ['Red', 'Blue', 'Black'] },
      { code: 'size', name: 'Size', values: ['S', 'M', 'L', 'XL'] }
    ],
    variants: [
      { id: 'var_1001_1', sku: 'TSHIRT-BASIC-RED-S', options: { color: 'Red', size: 'S' }, price: 19.99, stock: { available: 20 } },
      { id: 'var_1001_2', sku: 'TSHIRT-BASIC-RED-M', options: { color: 'Red', size: 'M' }, price: 19.99, stock: { available: 25 } },
      { id: 'var_1001_3', sku: 'TSHIRT-BASIC-BLUE-L', options: { color: 'Blue', size: 'L' }, price: 21.99, stock: { available: 18 } },
      { id: 'var_1001_4', sku: 'TSHIRT-BASIC-BLACK-XL', options: { color: 'Black', size: 'XL' }, price: 21.99, stock: { available: 15 } }
    ],
    createdAt: '2024-08-01T10:00:00.000Z',
    updatedAt: '2024-12-15T08:30:00.000Z'
  },
  {
    id: 'prod_1002',
    sku: 'SNEAKER-RUN',
    name: 'Runner Sneakers',
    description: 'Lightweight running sneakers with breathable mesh and cushioned sole.',
    status: 'active',
    price: 79.0,
    currency: 'USD',
    images: [
      { url: '/images/products/sneaker-run/main.jpg', alt: 'Runner Sneakers' }
    ],
    categories: ['footwear', 'sport'],
    stock: { managed: true, available: 42, reserved: 2 },
    attributes: [
      { group: 'General', fields: [ { code: 'brand', name: 'Brand', type: 'text', value: 'SimpleWear' } ] },
      { group: 'Dimensions', fields: [ { code: 'weight', name: 'Weight', type: 'number', unit: 'g', value: 650 } ] }
    ],
    options: [ { code: 'size', name: 'Size', values: ['40', '41', '42', '43', '44'] } ],
    variants: [
      { id: 'var_1002_1', sku: 'SNEAKER-RUN-42', options: { size: '42' }, price: 79.0, stock: { available: 10 } },
      { id: 'var_1002_2', sku: 'SNEAKER-RUN-43', options: { size: '43' }, price: 79.0, stock: { available: 8 } }
    ],
    createdAt: '2024-09-10T10:00:00.000Z',
    updatedAt: '2024-12-12T06:00:00.000Z'
  },
  {
    id: 'prod_1003',
    sku: 'MUG-COFFEE',
    name: 'Ceramic Coffee Mug',
    description: '11oz ceramic mug, dishwasher and microwave safe.',
    status: 'active',
    price: 12.5,
    currency: 'USD',
    images: [ { url: '/images/products/mug-coffee/main.jpg', alt: 'Ceramic Coffee Mug' } ],
    categories: ['home', 'kitchen'],
    stock: { managed: true, available: 200, reserved: 0 },
    attributes: [
      { group: 'General', fields: [ { code: 'brand', name: 'Brand', type: 'text', value: 'SimpleHome' }, { code: 'color', name: 'Color', type: 'text', value: 'White' } ] },
      { group: 'Dimensions', fields: [ { code: 'capacity', name: 'Capacity', type: 'number', unit: 'oz', value: 11 } ] }
    ],
    options: [],
    variants: [],
    createdAt: '2024-07-21T10:00:00.000Z',
    updatedAt: '2024-11-05T16:45:00.000Z'
  },
  {
    id: 'prod_1004',
    sku: 'BACKPACK-URBAN',
    name: 'Urban Backpack',
    description: 'Water-resistant urban backpack with padded laptop compartment (15-inch).',
    status: 'draft',
    price: 59.99,
    currency: 'USD',
    images: [ { url: '/images/products/backpack-urban/main.jpg', alt: 'Urban Backpack' } ],
    categories: ['bags', 'accessories'],
    stock: { managed: true, available: 12, reserved: 1 },
    attributes: [
      { group: 'General', fields: [ { code: 'brand', name: 'Brand', type: 'text', value: 'SimpleGear' }, { code: 'material', name: 'Material', type: 'text', value: 'Polyester' } ] },
      { group: 'Dimensions', fields: [ { code: 'volume', name: 'Volume', type: 'number', unit: 'L', value: 24 } ] },
      { group: 'SEO', fields: [ { code: 'meta_title', name: 'Meta Title', type: 'text', value: 'Urban Backpack - Water Resistant' } ] }
    ],
    options: [ { code: 'color', name: 'Color', values: ['Gray', 'Navy'] } ],
    variants: [
      { id: 'var_1004_1', sku: 'BACKPACK-URBAN-GRAY', options: { color: 'Gray' }, price: 59.99, stock: { available: 6 } },
      { id: 'var_1004_2', sku: 'BACKPACK-URBAN-NAVY', options: { color: 'Navy' }, price: 59.99, stock: { available: 5 } }
    ],
    createdAt: '2024-10-01T09:00:00.000Z',
    updatedAt: '2024-12-20T12:00:00.000Z'
  }
];

function getSampleProducts() {
  return sampleProducts;
}

module.exports = { sampleProducts, getSampleProducts };
