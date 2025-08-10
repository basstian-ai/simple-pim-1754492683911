const groups = [
  { id: 'grp-core', code: 'core', label: 'Core' },
  { id: 'grp-marketing', code: 'marketing', label: 'Marketing' },
];

const attributes = [
  { id: 'attr-sku', code: 'sku', label: 'SKU', type: 'text', groupId: 'grp-core', required: true },
  { id: 'attr-name', code: 'name', label: 'Name', type: 'text', groupId: 'grp-core', required: true },
  { id: 'attr-desc', code: 'description', label: 'Description', type: 'richtext', groupId: 'grp-marketing', required: false },
  { id: 'attr-brand', code: 'brand', label: 'Brand', type: 'text', groupId: 'grp-marketing', required: false },
];

function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405);
    res.setHeader('Allow', 'GET');
    return res.json({ error: 'Method Not Allowed' });
  }

  res.setHeader('Content-Type', 'application/json');
  // Cache lightly to avoid hammering the server while allowing quick edits during development
  res.setHeader('Cache-Control', 'public, max-age=60');

  return res.status(200).json({ groups, attributes });
}

module.exports = handler;
