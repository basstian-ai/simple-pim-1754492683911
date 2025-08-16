# Tasks (single source of truth)

```yaml
items:
  - type: bug
    title: Long-running queries hit 5-minute execution cap (BUG-dpl_8G-1755382640949)
    desc: >-
      A query exceeded the 5-minute execution limit and was terminated, causing runtime failures and incomplete results.
      Investigate the query plan (EXPLAIN/trace), add indexes/filters or paginate/batch work, and capture EXPLAIN on
      timeout for diagnostics.
    source: logs
    created: '2025-08-16T22:17:20.949Z'
    priority: 1
  - type: improvement
    title: Standardize API route conventions and documentation
    desc: >
      Define and enforce a consistent API route layout (pages/api vs server routes), naming conventions, and
      request/response schemas. Add route-level docs, examples, and linting/validation to the repo.
    source: review
    created: '2025-08-15T15:41:00.000Z'
    priority: 2
  - type: feature
    title: AI-assisted attribute suggestions in Admin
    desc: >
      Add an AI-backed suggestions panel to propose attribute groups, attribute values, and mapping hints based on
      product text and historical data. Include opt-in telemetry, preview mode, and an API route for suggestions.
    source: vision
    created: '2025-08-15T15:42:00.000Z'
    priority: 3
  - type: improvement
    title: SKU & slug uniqueness validation and collision handling
    desc: >
      Add robust validation to ensure SKU and slug uniqueness at creation and on edits; surface friendly errors, provide
      auto-suffixing options, and add tests for race conditions and concurrent writes.
    source: user
    created: '2025-08-15T15:43:00.000Z'
    priority: 4
  - type: improvement
    title: Accessibility audit and fixes for admin UI
    desc: >
      Run an a11y audit for key admin pages (products, attribute-groups, bulk-tags, dashboard), fix issues found (ARIA,
      keyboard focus, color contrast), and add automated accessibility checks to CI.
    source: review
    created: '2025-08-15T15:44:00.000Z'
    priority: 5
  - type: bug
    title: Long-running queries hit 5-minute execution cap (BUG-dpl_HK-1755266967960)
    desc: >
      Long-running query was terminated after surpassing the 5-minute execution cap, causing runtime errors and
      incomplete results. Investigate the offending query(s) (EXPLAIN/trace), add indexes/filters or paginate/batch
      work, and capture EXPLAIN on timeout for diagnostics.
    source: logs
    created: '2025-08-15T14:09:27.960Z'
    priority: 6
  - type: bug
    title: Long-running queries hit 5-minute execution cap (BUG-dpl_8G-1755344862515)
    desc: >
      One or more queries exceed the 5-minute execution limit and are being terminated, producing failures and
      incomplete responses. Review query plans, add pagination/batching or indexes, and consider instrumentation to
      identify and prevent future long runs.
    source: logs
    created: '2025-08-16T11:47:42.515Z'
    priority: 7
```
