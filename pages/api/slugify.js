import slugify from '../../lib/slugify';

export default function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Cache GET responses on the edge for a short time to reduce repeated work
  // and help avoid long-running backend load from frequent slugify calls.
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  }

  // Ensure JSON content-type for both GET and POST responses.
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const text = (
    (req.query && (req.query.q || req.query.text)) ||
    (req.body && req.body.text) ||
    ''
  ).toString();

  const result = slugify(text);
  return res.status(200).json({ slug: result });
}
