# Tasks (single source of truth)

```yaml
items:
  - type: improvement
    title: Accessibility audit and fixes for admin UI
    desc: >
      Run an a11y audit for key admin pages (products, attribute-groups, bulk-tags, dashboard), fix issues found (ARIA,
      keyboard focus, color contrast), and add automated accessibility checks to CI.
    source: review
    created: '2025-08-15T15:44:00.000Z'
    priority: 1
  - type: bug
    title: Long-running queries hit 5-minute execution cap (BUG-dpl_HK-1755266967960)
    desc: >
      Long-running query was terminated after surpassing the 5-minute execution cap, causing runtime errors and
      incomplete results. Investigate the offending query(s) (EXPLAIN/trace), add indexes/filters or paginate/batch
      work, and capture EXPLAIN on timeout for diagnostics.
    source: logs
    created: '2025-08-15T14:09:27.960Z'
    priority: 2
  - type: bug
    title: Long-running queries hit 5-minute execution cap (BUG-dpl_8G-1755344862515)
    desc: >
      One or more queries exceed the 5-minute execution limit and are being terminated, producing failures and
      incomplete responses. Review query plans, add pagination/batching or indexes, and consider instrumentation to
      identify and prevent future long runs.
    source: logs
    created: '2025-08-16T11:47:42.515Z'
    priority: 3
```
