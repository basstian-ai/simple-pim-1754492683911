# Tasks (single source of truth)

```yaml
items:
  - type: bug
    title: Query duration limit exceeded (BUG-dpl_8G-1755384666884)
    desc: >
      Queries are being terminated after hitting the 5-minute execution cap, leading to incomplete responses. Likely
      causes: inefficient joins, missing indexes or unbounded scans—optimize queries, add pagination, and improve
      monitoring.
    source: logs
    created: '2025-08-16T22:51:06.884Z'
    priority: 2
  - type: improvement
    title: Accessibility audit and fixes for admin UI
    desc: >
      Run an a11y audit for key admin pages (products, attribute-groups, bulk-tags, dashboard), fix issues found (ARIA,
      keyboard focus, color contrast), and add automated accessibility checks to CI.
    source: review
    created: '2025-08-15T15:44:00.000Z'
    priority: 3
  - type: bug
    title: Long-running queries hit 5-minute execution cap (BUG-dpl_HK-1755266967960)
    desc: >
      Long-running query was terminated after surpassing the 5-minute execution cap, causing runtime errors and
      incomplete results. Investigate the offending query(s) (EXPLAIN/trace), add indexes/filters or paginate/batch
      work, and capture EXPLAIN on timeout for diagnostics.
    source: logs
    created: '2025-08-15T14:09:27.960Z'
    priority: 4
  - type: bug
    title: Long-running queries hit 5-minute execution cap (BUG-dpl_8G-1755344862515)
    desc: >
      One or more queries exceed the 5-minute execution limit and are being terminated, producing failures and
      incomplete responses. Review query plans, add pagination/batching or indexes, and consider instrumentation to
      identify and prevent future long runs.
    source: logs
    created: '2025-08-16T11:47:42.515Z'
    priority: 5
```
