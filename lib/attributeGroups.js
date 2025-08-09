export function getAttributeGroups() {
  // Static demo data for attribute groups in the PIM
  return [
    {
      id: 'core',
      name: 'Core',
      description: 'Core product information used across the catalog.',
      attributes: [
        { code: 'name', type: 'text', label: 'Name', required: true },
        { code: 'sku', type: 'text', label: 'SKU', required: true },
        { code: 'description', type: 'richtext', label: 'Description', required: false },
        { code: 'status', type: 'select', label: 'Status', options: ['draft', 'active', 'archived'], required: true }
      ]
    },
    {
      id: 'pricing',
      name: 'Pricing',
      description: 'Prices, taxes and related commerce settings.',
      attributes: [
        { code: 'price', type: 'number', label: 'Price', unit: 'USD', required: true },
        { code: 'compare_at_price', type: 'number', label: 'Compare at Price', unit: 'USD', required: false },
        { code: 'tax_class', type: 'select', label: 'Tax Class', options: ['standard', 'reduced', 'exempt'], required: true }
      ]
    },
    {
      id: 'inventory',
      name: 'Inventory',
      description: 'Stock management fields for fulfillment.',
      attributes: [
        { code: 'stock', type: 'number', label: 'Stock Qty', required: false },
        { code: 'manage_stock', type: 'boolean', label: 'Manage Stock', required: false },
        { code: 'backorders', type: 'select', label: 'Backorders', options: ['no', 'allow', 'notify'], required: false }
      ]
    }
  ];
}

export function findAttributeGroup(id) {
  return getAttributeGroups().find((g) => g.id === id) || null;
}

export function listAllAttributesFlat() {
  const groups = getAttributeGroups();
  return groups.flatMap((g) => g.attributes.map((a) => ({ groupId: g.id, groupName: g.name, ...a })));
}
