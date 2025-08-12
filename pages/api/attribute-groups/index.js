import withErrorHandling from '../../../lib/api/withErrorHandling';

async function handler(req, res) {
  if (req.method === 'GET') {
    const { loadAttributeGroups } = require('../../../lib/attributeGroups');
    const groups = loadAttributeGroups();
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

/**
 * Wrap a handler to ensure we return a timely response to the client
 * if the inner handler takes too long. This avoids leaving clients waiting
 * indefinitely and helps serverless environments recover from long backend queries.
 *
 * Note: this does NOT abort the inner handler; it only ensures we respond
 * with 504 after the timeout. The inner work may continue to finish on the server.
 */
function withTimeout(innerHandler, ms = 30_000) {
  return async function (req, res) {
    let finished = false;
    const timeoutId = setTimeout(() => {
      if (!finished && !res.headersSent) {
        try {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
        } catch (_) {}
        try {
          res.status(504).json({ error: `Request timed out after ${Math.floor(ms / 1000)}s` });
        } catch (_) {}
      }
    }, ms);

    try {
      await innerHandler(req, res);
    } finally {
      finished = true;
      clearTimeout(timeoutId);
    }
  };
}

// Wrap the handler with a 30s timeout and the existing error handler.
export default withErrorHandling(withTimeout(handler, 30_000));
