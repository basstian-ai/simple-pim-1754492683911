const store = require('../../lib/attributeStore');

export default function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    res.status(200).json({ attributeGroups: store.getAttributeGroups() });
    return;
  }

  if (method === 'POST') {
    try {
      const body = req.body || {};
      const { type } = body;

      if (type === 'group') {
        const { name } = body;
        const g = store.addGroup(name);
        res.status(200).json({ ok: true, group: g, attributeGroups: store.getAttributeGroups() });
        return;
      }

      if (type === 'attribute') {
        const { groupId, attribute } = body;
        const a = store.addAttribute(groupId, attribute || {});
        res.status(200).json({ ok: true, attribute: a, attributeGroups: store.getAttributeGroups() });
        return;
      }

      res.status(400).json({ ok: false, error: 'Unknown type. Use "group" or "attribute".' });
    } catch (e) {
      res.status(400).json({ ok: false, error: e.message || 'Bad Request' });
    }
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end('Method Not Allowed');
}
