# Tasks (single source of truth)

```yaml
items:
  - type: bug
    title: Query duration exceeded (long-running queries terminated)
    desc: >
      Investigate and fix long-running queries that are being terminated after the 5-minute execution cap. Actions:
      capture slow query text + EXPLAIN plans, add/migrate indexes, add filters/pagination or batched processing, and
      add safeguards (timeouts, cancellations, retries) and regression tests.
    source: logs
    created: '2025-08-15T14:09:27.960Z'
    priority: 3
  - type: improvement
    title: Attribute Groups Search (filters & pagination)
    desc: >
      Provide searchable API and admin UI for attribute groups with filters (code, label, type, required) and
      server-side pagination. Include robust error handling, API + UI tests and documentation updates.
    source: vision
    created: '2025-08-15T15:33:27.457Z'
    priority: 4
  - type: improvement
    title: Consolidate duplicate server & route directories
    desc: >
      Remove or merge duplicate server code paths (server vs src/server and src/routes vs src/server/routes), update
      imports, and add CI checks to prevent regressions. Ensure a single canonical source for server logic and document
      the chosen layout.
    source: review
    created: '2025-08-15T15:40:00.000Z'
    priority: 5
  - type: improvement
    title: Standardize API route conventions and documentation
    desc: >
      Define and enforce a consistent API route layout (pages/api vs server routes), naming conventions, and
      request/response schemas. Add route-level docs, examples, and linting/validation to the repo.
    source: review
    created: '2025-08-15T15:41:00.000Z'
    priority: 6
  - type: feature
    title: AI-assisted attribute suggestions in Admin
    desc: >
      Add an AI-backed suggestions panel to propose attribute groups, attribute values, and mapping hints based on
      product text and historical data. Include opt-in telemetry, preview mode, and an API route for suggestions.
    source: vision
    created: '2025-08-15T15:42:00.000Z'
    priority: 7
  - type: improvement
    title: SKU & slug uniqueness validation and collision handling
    desc: >
      Add robust validation to ensure SKU and slug uniqueness at creation and on edits; surface friendly errors, provide
      auto-suffixing options, and add tests for race conditions and concurrent writes.
    source: user
    created: '2025-08-15T15:43:00.000Z'
    priority: 8
  - type: improvement
    title: Accessibility audit and fixes for admin UI
    desc: >
      Run an a11y audit for key admin pages (products, attribute-groups, bulk-tags, dashboard), fix issues found (ARIA,
      keyboard focus, color contrast), and add automated accessibility checks to CI.
    source: review
    created: '2025-08-15T15:44:00.000Z'
    priority: 9
```
