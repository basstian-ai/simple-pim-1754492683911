function getAttributeGroups() {
  return [
    {
      id: 'general',
      name: 'General',
      attributes: [
        { code: 'name', label: 'Name', type: 'text', required: true },
        { code: 'sku', label: 'SKU', type: 'text', required: true },
        { code: 'description', label: 'Description', type: 'richtext', required: false }
      ]
    },
    {
      id: 'pricing',
      name: 'Pricing',
      attributes: [
        { code: 'price', label: 'Price', type: 'number', required: true, unit: 'USD' },
        { code: 'sale_price', label: 'Sale Price', type: 'number', required: false, unit: 'USD' }
      ]
    },
    {
      id: 'inventory',
      name: 'Inventory',
      attributes: [
        { code: 'stock', label: 'Stock', type: 'integer', required: false },
        { code: 'availability', label: 'Availability', type: 'select', options: ['in_stock', 'out_of_stock', 'preorder'], required: false }
      ]
    }
  ];
}

module.exports = {
  getAttributeGroups
};
