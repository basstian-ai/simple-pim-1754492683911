# Query Runner

Small helper to run queries with per-attempt timeouts and retries. Designed to help "graceful handling for long queries" by ensuring long-running operations are canceled (via AbortSignal) per attempt and retried with backoff.

Usage:

const { runWithTimeoutRetry } = require('./src/queryRunner');

await runWithTimeoutRetry(async ({ signal, attempt }) => {
  // your query logic here; if possible, respond to signal.aborted or signal 'abort' event
}, { attempts: 3, perAttemptTimeout: 2000 });

API notes:
- queryFn({ signal, attempt }) should accept an AbortSignal and cancel in-progress work when signal is aborted. Many fetch/http libraries accept AbortSignal.
- On final failure a TimeoutError is thrown with metadata (attempts, perAttemptTimeout, lastError).

Run tests: npm install && npm test
