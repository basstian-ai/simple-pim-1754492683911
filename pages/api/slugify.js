import slugify from '../../lib/slugify';

export default function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const text = (
    (req.query && (req.query.q || req.query.text)) ||
    (req.body && req.body.text) ||
    ''
  ).toString();

  const result = slugify(text);
  return res.status(200).json({ slug: result });
}
