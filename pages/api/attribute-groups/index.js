import withErrorHandling from '../../../lib/api/withErrorHandling';
import withTimeout from '../../../lib/api/withTimeout';

async function handler(req, res) {
  // Ensure JSON content-type for all responses from this endpoint to help clients
  // and observability tools. Setting early avoids ambiguous responses when errors occur.
  try {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  } catch (_) {}

  if (req.method === 'GET') {
    const { loadAttributeGroups } = require('../../../lib/attributeGroups');
    const groups = loadAttributeGroups();
    // Short edge cache to reduce repeated load for this read-heavy endpoint.
    // Keep responses fresh-ish while allowing the CDN to serve repeated requests.
    try {
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    } catch (_) {}
    res.status(200).json({ groups });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET,OPTIONS');
    res.status(204).end();
    return;
  }

  res.setHeader('Allow', 'GET,OPTIONS');
  res.status(405).json({ error: 'Method Not Allowed' });
}

// Wrap the handler with a 30s timeout and the existing error handler.
export default withErrorHandling(withTimeout(handler, 30_000));

