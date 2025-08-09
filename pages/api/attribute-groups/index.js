/*
  Attribute Groups API
  - GET /api/attribute-groups -> { items: [...] }
  - POST /api/attribute-groups { name, code } -> 201 created group
*/

let groups = [
  { id: 'grp-basic', code: 'basic', name: 'Basic' },
  { id: 'grp-seo', code: 'seo', name: 'SEO' },
];

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function normalizeCode(code) {
  return String(code)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function handler(req, res) {
  const method = req.method || 'GET';
  if (method === 'GET') {
    res.status(200).json({ items: groups });
    return;
  }
  if (method === 'POST') {
    const body = req.body || {};
    const name = isNonEmptyString(body.name) ? body.name.trim() : '';
    const rawCode = isNonEmptyString(body.code) ? body.code : name;
    const code = normalizeCode(rawCode);

    if (!isNonEmptyString(name) || !isNonEmptyString(code)) {
      res.status(400).json({ error: 'Invalid name or code.' });
      return;
    }

    const exists = groups.some((g) => g.code === code);
    if (exists) {
      res.status(409).json({ error: `Attribute group with code "${code}" already exists.` });
      return;
    }

    const newGroup = {
      id: `grp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      code,
      name,
    };
    groups = [...groups, newGroup];
    res.status(201).json(newGroup);
    return;
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ error: 'Method Not Allowed' });
}
