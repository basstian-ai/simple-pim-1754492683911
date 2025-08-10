'use strict';

const {
  listGroups,
  createGroup,
  validateGroupPayload,
} = require('../../../lib/attributeGroups');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'GET') {
    const groups = listGroups();
    res.status(200).json({ data: groups });
    return;
  }
  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const { valid, errors } = validateGroupPayload(body);
      if (!valid) {
        res.status(400).json({ error: 'Validation failed', details: errors });
        return;
      }
      const created = createGroup(body);
      res.status(201).json({ data: created });
      return;
    } catch (e) {
      if (e && e.code === 'DUPLICATE_NAME') {
        res.status(409).json({ error: e.message });
        return;
      }
      if (e && e.code === 'VALIDATION_ERROR') {
        res.status(400).json({ error: e.message, details: e.details || [] });
        return;
      }
      console.error('POST /api/attribute-groups error', e);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ error: 'Method Not Allowed' });
};
