export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }

  const payload = {
    ok: true,
    updatedAt: new Date().toISOString(),
    groups: [
      {
        id: 'basic',
        label: 'Basic',
        description: 'Core product identification fields',
        attributes: [
          { code: 'name', label: 'Name', type: 'text', required: true },
          { code: 'sku', label: 'SKU', type: 'text', required: true },
          { code: 'description', label: 'Description', type: 'richtext', required: false }
        ]
      },
      {
        id: 'pricing',
        label: 'Pricing',
        description: 'Price and currency configuration',
        attributes: [
          { code: 'price', label: 'Price', type: 'number', required: true },
          { code: 'currency', label: 'Currency', type: 'select', options: ['USD', 'EUR', 'GBP'], required: true },
          { code: 'sale_price', label: 'Sale Price', type: 'number', required: false }
        ]
      },
      {
        id: 'variants',
        label: 'Variants',
        description: 'Common variant-defining attributes',
        attributes: [
          { code: 'color', label: 'Color', type: 'swatch', required: false },
          { code: 'size', label: 'Size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL'], required: false },
          { code: 'material', label: 'Material', type: 'text', required: false }
        ]
      }
    ]
  };

  res.status(200).json(payload);
}
