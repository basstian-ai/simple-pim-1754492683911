/** 
 * Wrap a promise with a timeout.
 */
/**
 * Flexible withTimeout utility.
 *
 * Usage:
 * 1) As a promise wrapper:
 *    withTimeout(somePromise, ms).then(...)
 *
 * 2) As an HTTP handler wrapper (middleware-like):
 *    // returns a function (req, res) => Promise
 *    export default withTimeout(handler, ms);
 *
 * The function detects whether the first argument is a function (handler)
 * or a promise-like value and adapts accordingly. This keeps backward
 * compatibility with earlier usages while providing a safe wrapper for
 * Next.js API handlers to limit execution time.
 */
export function withTimeout(handlerOrPromise, ms = 5000, message = 'Timeout') {
  // If a function is provided, return a wrapped handler(req, res)
  if (typeof handlerOrPromise === 'function') {
    const handler = handlerOrPromise;
    return function wrappedHandler(req, res) {
      return new Promise((resolve, reject) => {
        let finished = false;
        const start = Date.now();

        const timer = setTimeout(() => {
          if (finished) return;
          finished = true;
          const err = new Error(message);
          err.code = 'ETIMEDOUT';
          // Try to send a best-effort 504 if headers not sent.
          try {
            if (!res.headersSent) {
              res.setHeader && res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.setHeader && res.setHeader('X-Timeout', 'true');
              res.status && res.status(504).json && res.status(504).json({ error: message });
            }
          } catch (_) {}
          reject(err);
        }, ms);

        // Execute handler and resolve/reject based on its outcome.
        Promise.resolve()
          .then(() => handler(req, res))
          .then((v) => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            // attach timing header if possible
            try { if (!res.headersSent) res.setHeader && res.setHeader('X-Response-Time-ms', String(Date.now() - start)); } catch (_) {}
            resolve(v);
          })
          .catch((e) => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            reject(e);
          });
      });
    };
  }

  // Otherwise treat the first arg as a promise-like and wrap it.
  const promise = handlerOrPromise;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    Promise.resolve(promise).then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); }
    );
  });
}

export default withTimeout;
