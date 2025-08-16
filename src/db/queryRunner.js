const { QueryTimeoutError } = require('../errors');

/**
 * runQueryWithTimeout runs a query executor and enforces a timeout.
 * If the timeout is reached it will attempt to call executor.cancel() (if provided),
 * then call executor.explain() (if provided) to capture an EXPLAIN plan and attach
 * it to the thrown QueryTimeoutError as the `explain` property.
 *
 * executor: { execute: ()=>Promise<any>, cancel?: ()=>void|Promise<void>, explain?: ()=>Promise<any> }
 * options: { timeoutMs?: number }
 */
async function runQueryWithTimeout(executor, options) {
  const timeoutMs = (options && options.timeoutMs) || 5 * 60 * 1000;
  let timeoutHandle;

  // Promise that rejects after timeoutMs with QueryTimeoutError which may include explain
  const timeoutPromise = new Promise((_, reject) => {
    timeoutHandle = setTimeout(async () => {
      const err = new QueryTimeoutError(`Query exceeded timeout of ${timeoutMs}ms`);

      // Best-effort cancellation
      try {
        if (typeof executor.cancel === 'function') {
          // allow cancel to be sync or async
          await executor.cancel();
        }
      } catch (e) {
        // ignore cancellation errors
      }

      // Capture EXPLAIN if available (best-effort)
      if (typeof executor.explain === 'function') {
        try {
          const explainRes = await executor.explain();
          err.explain = explainRes;
        } catch (e) {
          err.explain = { error: String(e) };
        }
      }

      reject(err);
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([executor.execute(), timeoutPromise]);
    clearTimeout(timeoutHandle);
    return result;
  } finally {
    clearTimeout(timeoutHandle);
  }
}

module.exports = { runQueryWithTimeout };
