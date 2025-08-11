const variantsLib = require('../../../../lib/variants');

async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};
    const axes = Array.isArray(body.axes) ? body.axes : [];
    const baseSku = typeof body.baseSku === 'string' ? body.baseSku : '';
    const baseName = typeof body.baseName === 'string' ? body.baseName : '';

    // Basic validation
    if (!Array.isArray(axes) || axes.length === 0) {
      return res.status(400).json({ error: 'axes must be a non-empty array' });
    }
    for (const a of axes) {
      if (!a || typeof a.code !== 'string' || !Array.isArray(a.options) || a.options.length === 0) {
        return res.status(400).json({ error: 'each axis requires code and non-empty options array' });
      }
    }

    const result = variantsLib.generateVariants(axes, { baseSku, baseName });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error', message: err && err.message });
  }
}

module.exports = handler;
exports.default = handler;
