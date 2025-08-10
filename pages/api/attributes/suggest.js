const { suggestAttributesFromText } = require('../../../lib/attributeSuggestor');

export default function handler(req, res) {
  // Allow simple CORS for local tooling and GET for convenience
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    let text = '';
    if (req.method === 'GET') {
      text = (req.query.text || '').toString();
    } else if (req.method === 'POST') {
      if (typeof req.body === 'string') {
        try {
          const parsed = JSON.parse(req.body);
          text = parsed.description || parsed.text || '';
        } catch (e) {
          text = '';
        }
      } else {
        text = (req.body && (req.body.description || req.body.text)) || '';
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Missing description/text' });
      return;
    }

    const attributes = suggestAttributesFromText(text);
    res.status(200).json({ attributes, count: attributes.length });
  } catch (err) {
    console.error('attribute suggestion error', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
