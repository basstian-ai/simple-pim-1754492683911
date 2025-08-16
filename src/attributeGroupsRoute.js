const express = require('express');
const router = express.Router();
const { searchAttributeGroups } = require('./attributeGroupsService');

router.get('/attribute-groups', (req, res) => {
  try {
    const { q, code, label, type, required, page, perPage } = req.query;

    // Validate pagination params
    if (page !== undefined && (!/^[1-9]\d*$/.test(String(page)))) {
      return res.status(400).json({ error: 'page must be a positive integer' });
    }
    if (perPage !== undefined && (!/^[1-9]\d*$/.test(String(perPage)))) {
      return res.status(400).json({ error: 'perPage must be a positive integer' });
    }

    const data = searchAttributeGroups({ q, code, label, type, required, page, perPage });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message || 'invalid request' });
  }
});

module.exports = router;
