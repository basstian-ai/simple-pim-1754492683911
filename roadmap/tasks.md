# Tasks (single source of truth)

```yaml
items:
  - type: bug
    title: App runtime errors & warnings from latest deployment
    desc: >
      Long-running query(s) exceeded the 5-minute execution cap and were terminated, causing runtime errors and warnings
      in the deployed app. Likely causes: missing indexes, full-table scans, or inefficient query plans. Recommended:
      capture EXPLAIN plans, add indexes/filters, paginate/batch work, and add monitoring/alerts.
    source: logs
    created: '2025-08-15T14:09:27.960Z'
    priority: 1
  - type: improvement
    title: Consolidate duplicate server & route directories
    desc: >
      Remove or merge duplicate server code paths (server vs src/server and src/routes vs src/server/routes), update
      imports, and add CI checks to prevent regressions. Ensure a single canonical source for server logic and document
      the chosen layout.
    source: review
    created: '2025-08-15T15:40:00.000Z'
    priority: 2
  - type: improvement
    title: Standardize API route conventions and documentation
    desc: >
      Define and enforce a consistent API route layout (pages/api vs server routes), naming conventions, and
      request/response schemas. Add route-level docs, examples, and linting/validation to the repo.
    source: review
    created: '2025-08-15T15:41:00.000Z'
    priority: 3
  - type: feature
    title: AI-assisted attribute suggestions in Admin
    desc: >
      Add an AI-backed suggestions panel to propose attribute groups, attribute values, and mapping hints based on
      product text and historical data. Include opt-in telemetry, preview mode, and an API route for suggestions.
    source: vision
    created: '2025-08-15T15:42:00.000Z'
    priority: 4
  - type: improvement
    title: SKU & slug uniqueness validation and collision handling
    desc: >
      Add robust validation to ensure SKU and slug uniqueness at creation and on edits; surface friendly errors, provide
      auto-suffixing options, and add tests for race conditions and concurrent writes.
    source: user
    created: '2025-08-15T15:43:00.000Z'
    priority: 5
  - type: improvement
    title: Accessibility audit and fixes for admin UI
    desc: >
      Run an a11y audit for key admin pages (products, attribute-groups, bulk-tags, dashboard), fix issues found (ARIA,
      keyboard focus, color contrast), and add automated accessibility checks to CI.
    source: review
    created: '2025-08-15T15:44:00.000Z'
    priority: 6
```
