const groups = require('../../data/attribute-groups.json');

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).json(groups);
};
