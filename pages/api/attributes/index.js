const fs = require('fs');
const path = require('path');

function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'attributes.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    res.statusCode = 200;
    res.json(data);
  } catch (e) {
    res.statusCode = 500;
    res.json({ error: 'Failed to load attributes' });
  }
}

module.exports = handler;
module.exports.handler = handler;
