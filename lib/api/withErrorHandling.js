// Small wrapper to ensure API handlers don't crash the runtime.
// Catches synchronous and async errors and returns a safe 500 JSON response.
export default function withErrorHandling(handler) {
  return async function (req, res) {
    try {
      return await handler(req, res);
    } catch (err) {
      // Log for server-side diagnostics (keeps original error/stack)
      if (typeof console !== 'undefined' && console.error) {
        console.error('Unhandled API handler error:', err && err.stack ? err.stack : err);
      }

      // If headers already sent, attempt to close the response gracefully.
      if (res.headersSent) {
        try {
          res.end();
        } catch (_) {}
        return;
      }

      // Return a JSON-safe 500 response to clients.
      try {
        res.status(500).json({
          error: 'Internal Server Error',
          message: err && err.message ? err.message : 'Unexpected error',
        });
      } catch (_) {
        // If even this fails, ensure we don't throw.
      }
    }
  };
}

