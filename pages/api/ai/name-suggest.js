import generateNameSuggestions from '../../../lib/generateNameSuggestions';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const product = req.body || {};

  try {
    const suggestions = generateNameSuggestions(product);
    return res.status(200).json({ suggestions });
  } catch (err) {
    // Keep error message minimal but informative for debugging in dev
    return res.status(500).json({ error: err && err.message ? err.message : 'Server error' });
  }
}
