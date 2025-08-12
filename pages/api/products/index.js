import productsHandler from '../../../lib/api/productsHandler';
import withErrorHandling from '../../../lib/api/withErrorHandling';

// Lightweight wrapper to add caching headers for GET requests.
// Keeps the underlying handler behaviour intact while reducing repeated load
// from clients by instructing the CDN/edge to cache responses briefly.
async function handler(req, res) {
  // Ensure we always respond with JSON content-type for observability and clients.
  // Setting this early prevents ambiguous responses if we hit the timeout path.
  try {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  } catch (_) {}

  // Add permissive CORS headers to make this API easier to call from tools
  // and local development without changing server behaviour. Preflight (OPTIONS)
  // requests are answered early.
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  } catch (_) {}

  // Answer preflight requests early and consistently so clients/tools don't
  // accidentally invoke the underlying handler when only a preflight is needed.
  if (req.method === 'OPTIONS') {
    // No body for preflight responses.
    res.status(204).end();
    return;
  }

  // Short edge cache for GETs to reduce repeated load
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  }

  // Prevent extremely long-running requests from hanging serverless functions.
  // If the underlying handler takes longer than TIMEOUT_MS, we respond with 504.
  // Note: this does not abort the inner handler; it avoids leaving the client waiting.
  // Reduce the default timeout to 30s to better protect serverless executions
  // from very long-running backend operations that can exceed platform limits.
  const TIMEOUT_MS = 30_000; // 30 seconds
  let finished = false;
  const start = Date.now();

  const timeoutId = setTimeout(() => {
    if (!finished && !res.headersSent) {
      try {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      } catch (_) {}
      try {
        // Mark that this response was a timeout and include elapsed time for debugging.
        res.setHeader('X-Timeout', 'true');
        res.setHeader('X-Response-Time-ms', String(Date.now() - start));
      } catch (_) {}
      // Best-effort 504 response on timeout
      try {
        res.status(504).json({ error: `Request timed out after ${Math.floor(TIMEOUT_MS / 1000)}s` });
      } catch (_) {}
    }
  }, TIMEOUT_MS);

  try {
    // Await in case the handler returns a promise; otherwise works with sync handlers too.
    await productsHandler(req, res);
  } finally {
    finished = true;
    // Expose timing to help diagnose long-running handlers without changing behavior.
    try {
      if (!res.headersSent) {
        res.setHeader('X-Response-Time-ms', String(Date.now() - start));
      }
    } catch (_) {}
    clearTimeout(timeoutId);
  }
}

export default withErrorHandling(handler);
