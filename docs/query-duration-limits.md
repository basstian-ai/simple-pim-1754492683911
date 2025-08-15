# Query Duration Limits

This document explains the system-level query duration limits, expected behaviors when limits are hit, and best-practice workarounds. It is intended to help users and integrators avoid "Query Duration Limit Exceeded" errors and to provide clear troubleshooting steps.

## Summary of limits (defaults)

- API gateway / interactive queries: 30s (30,000 ms)
- Background export jobs / async transforms: 5m (300,000 ms) per attempt
- Retry/backoff policy on export jobs: exponential backoff with bounded attempts (configurable)

Note: These values are defaults and may vary by deployment or environment. Operators can surface different limits via environment variables such as `QUERY_MAX_MS` and `EXPORT_JOB_MAX_MS`.

## What happens when a limit is exceeded

- Interactive requests that exceed the gateway limit are terminated and receive a 504 (Gateway Timeout) or a 408/429-style response depending on intermediary policies. The structured error will include an error code `QUERY_TIMEOUT` and a human-friendly message:

  - HTTP status: 504
  - Error code: `QUERY_TIMEOUT`
  - Example message: "Query duration exceeded the 30s limit. Consider narrowing your query or using pagination/async export."

- Background export attempts that exceed the per-attempt limit are marked failed for that attempt and will follow the job's retry policy. Most export jobs are implemented to be idempotent and resumeable; long-running exports should use pagination/streaming.

## Why these limits exist

- Protect shared resources and keep interactive UX snappy.
- Prevent runaway queries from impacting other tenants or jobs.
- Encourage using appropriate patterns (pagination, streaming, async jobs) for large data sets.

## Recommendations and workarounds

1. Paginate large result sets

   - Use the API pagination cursor/limit parameters to request data in slices. This is the primary recommended approach for large catalogs or bulk read operations.

2. Use async export jobs for heavy workloads

   - If you need a full export or heavy aggregation, kick off an async export job. These jobs have longer per-attempt limits, checkpointing/pagination, and retry/backoff.

3. Push filtering and projection to the server

   - Narrow the dataset by filtering (by channel, category, updatedAt range, etc.). Also request only the attributes/fields you need (projection) to reduce processing time.

4. Add server-side indexes to heavy filters

   - Ensure attributes frequently used for filtering or joins are indexed. Work with your operators or DB team to identify hotspots.

5. Use streaming or cursor APIs where available

   - Streaming reduces memory pressure and allows consumers to process records as they arrive instead of waiting for a complete response.

6. Avoid N+1 patterns

   - Use batched queries and server-side joins/aggregations where possible instead of running many small sequential queries.

## Instrumentation and monitoring

We expose metrics that help diagnose timeout issues:

- query.duration.ms (histogram): distribution of query durations
- query.timeouts.count: number of queries terminated due to duration limits
- export.job.attempt.duration.ms: duration per export attempt

If you observe sustained tail latencies or high timeouts, consider capturing traces for long-running requests and contacting the platform team for assistance.

## Troubleshooting checklist

1. Reproduce with a tighter filter and confirm whether the smaller query succeeds.
2. Try pagination - does each page succeed within the limit?
3. Check server-side logs/trace for the failed request ID (if available) to identify slow operations (e.g., full table scans, large aggregations).
4. If the query is part of an export job, verify the job's retry/timeout configuration and whether the job uses checkpointing/pagination.
5. If you need a temporary increase for a known-good long-running operation (e.g., one-off migration), contact the platform operators. Be prepared to share the query, expected duration, and business justification.

## Example patterns

- Interactive product search (recommendation): keep queries < 30s by limiting facets and page size to small values (for example, 20-100 items per page) and using server-side indexing.

- Full-catalog export: implement as an async job that pages through results in chunks (for example, 1,000–10,000 items per page depending on payload size) and writes incremental checkpoints.

## Error messages (examples)

- Interactive timeout:

  {
    "status": 504,
    "code": "QUERY_TIMEOUT",
    "message": "Query duration exceeded the 30s limit. Consider narrowing your query or using pagination/async export."
  }

- Export attempt timed out (background):

  {
    "jobId": "export_abc123",
    "attempt": 3,
    "status": "failed",
    "reason": "EXPORT_ATTEMPT_TIMEOUT",
    "message": "Attempt exceeded the 300000ms per-attempt limit and will be retried according to job policy."
  }

## Configuration (operator notes)

- Expose `QUERY_MAX_MS` for interactive/API gateway limits.
- Expose `EXPORT_JOB_MAX_MS` for per-attempt export job limits.
- Ensure these values are documented per-environment and surfaced to support/observability dashboards.

## Contact and escalation

If you continue to see frequent query duration errors after following the recommendations above, open a support ticket and include:

- Example failing request (query params, approximate payload size)
- Request ID or timestamp for the failure
- Metrics or traces if available

Include the tag `platform:query-timeouts` to route to the platform reliability team.

---

This doc is intentionally prescriptive: it lists defaults, expected behavior, how to avoid/mitigate errors, and what to collect when escalating. If limits change, update this document and add a short changelog entry describing the new defaults and the deployment environment(s) affected.
