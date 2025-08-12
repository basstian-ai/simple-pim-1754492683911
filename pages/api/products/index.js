import productsHandler from '../../../lib/api/productsHandler';
import withErrorHandling from '../../../lib/api/withErrorHandling';

// Lightweight wrapper to add caching headers for GET requests.
// Keeps the underlying handler behaviour intact while reducing repeated load
// from clients by instructing the CDN/edge to cache responses briefly.
async function handler(req, res) {
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  }
  return productsHandler(req, res);
}

export default withErrorHandling(handler);

