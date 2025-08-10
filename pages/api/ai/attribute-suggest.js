const { suggestAttributes } = require('../../../lib/attributeSuggest');

export default async function handler(req, res) {
  try {
    let text = '';
    if (req.method === 'POST') {
      // Next.js parses JSON by default if header is application/json
      if (typeof req.body === 'string') {
        try {
          const parsed = JSON.parse(req.body);
          text = parsed.text || parsed.description || '';
        } catch (e) {
          text = req.body;
        }
      } else {
        text = (req.body && (req.body.text || req.body.description)) || '';
      }
    } else if (req.method === 'GET') {
      text = (req.query && (req.query.text || req.query.q)) || '';
    } else if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    if (!text || !text.trim()) {
      res.status(400).json({ error: 'Missing text. Provide { text } in POST body or ?text= in query.' });
      return;
    }

    const suggestions = suggestAttributes(text);

    res.status(200).json({
      suggestions,
      meta: {
        inputLength: text.length,
        count: suggestions.length,
      },
    });
  } catch (err) {
    console.error('attribute-suggest error', err);
    res.status(500).json({ error: 'Internal error' });
  }
}
