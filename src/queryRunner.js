'use strict';

const { TimeoutError } = require('./errors');

function _sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      cleanup();
      resolve();
    }, ms);

    function onAbort() {
      cleanup();
      const err = new Error('sleep aborted');
      err.name = 'AbortError';
      reject(err);
    }

    function cleanup() {
      clearTimeout(t);
      if (signal) signal.removeEventListener('abort', onAbort);
    }

    if (signal) {
      if (signal.aborted) return onAbort();
      signal.addEventListener('abort', onAbort);
    }
  });
}

/**
 * Run a query function with per-attempt timeout and retries.
 *
 * queryFn receives an options object: { signal, attempt }
 * - signal: AbortSignal that will be aborted when the per-attempt timeout elapses
 * - attempt: 1-based attempt index
 *
 * options:
 * - attempts (number): max attempts (default 3)
 * - perAttemptTimeout (ms): timeout per attempt (default 2000)
 * - backoff (ms): base backoff for exponential backoff between attempts (default 200)
 * - maxBackoff (ms): upper cap for backoff (default 2000)
 *
 * On final failure a TimeoutError is thrown with metadata { attempts, perAttemptTimeout, lastError }
 */
async function runWithTimeoutRetry(queryFn, options = {}) {
  const {
    attempts = 3,
    perAttemptTimeout = 2000,
    backoff = 200,
    maxBackoff = 2000
  } = options;

  if (typeof queryFn !== 'function') {
    throw new TypeError('queryFn must be a function');
  }

  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const controller = new AbortController();
    const { signal } = controller;

    // set per-attempt timeout
    const t = setTimeout(() => {
      // abort the controller so well-behaved queryFns can cancel
      try {
        controller.abort();
      } catch (e) {
        // ignore
      }
    }, perAttemptTimeout);

    try {
      const result = await queryFn({ signal, attempt });
      clearTimeout(t);
      return result;
    } catch (err) {
      clearTimeout(t);
      lastError = err;

      // if this was the final attempt, wrap and rethrow
      if (attempt === attempts) {
        const meta = {
          attempts: attempt,
          perAttemptTimeout,
          lastError: err
        };
        throw new TimeoutError('Query failed after all attempts', meta);
      }

      // backoff before next attempt, but respect AbortSignal if queryFn aborted internal operations
      const delay = Math.min(backoff * Math.pow(2, attempt - 1), maxBackoff);
      try {
        // Use a fresh AbortController for sleep so caller can still cancel at outer level if needed in future enhancements
        await _sleep(delay);
      } catch (sleepErr) {
        // ignore and continue to next attempt
      }
    }
  }
}

module.exports = {
  runWithTimeoutRetry
};
