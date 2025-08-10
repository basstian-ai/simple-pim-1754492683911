const store = require('../../lib/data/attributesStore');

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const snap = store.getSnapshot();
      return res.status(200).json({ ok: true, data: { groups: snap.groups, updatedAt: snap.updatedAt } });
    }

    const body = req.body || {};
    const op = body.op;

    if (!op) {
      return res.status(400).json({ ok: false, error: 'Missing op' });
    }

    switch (req.method) {
      case 'POST': {
        let result = null;
        if (op === 'addGroup') {
          result = store.addGroup(body.name);
        } else if (op === 'addAttribute') {
          result = store.addAttribute(body.groupId, body.attribute);
        } else {
          return res.status(400).json({ ok: false, error: 'Unsupported op for POST' });
        }
        const snap = store.getSnapshot();
        return res.status(200).json({ ok: true, result, data: { groups: snap.groups, updatedAt: snap.updatedAt } });
      }
      case 'PUT': {
        let result = null;
        if (op === 'renameGroup') {
          result = store.renameGroup(body.id, body.name);
        } else if (op === 'updateAttribute') {
          result = store.updateAttribute(body.groupId, body.attrId, body.patch);
        } else {
          return res.status(400).json({ ok: false, error: 'Unsupported op for PUT' });
        }
        const snap = store.getSnapshot();
        return res.status(200).json({ ok: true, result, data: { groups: snap.groups, updatedAt: snap.updatedAt } });
      }
      case 'DELETE': {
        let result = null;
        if (op === 'deleteGroup') {
          result = store.deleteGroup(body.id);
        } else if (op === 'deleteAttribute') {
          result = store.deleteAttribute(body.groupId, body.attrId);
        } else {
          return res.status(400).json({ ok: false, error: 'Unsupported op for DELETE' });
        }
        const snap = store.getSnapshot();
        return res.status(200).json({ ok: true, result, data: { groups: snap.groups, updatedAt: snap.updatedAt } });
      }
      default:
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('API /attributes error', err);
    return res.status(500).json({ ok: false, error: err.message || 'Internal error' });
  }
}
