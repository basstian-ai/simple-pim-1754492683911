# Tasks (single source of truth)

```yaml
items:
  - type: feature
    title: Full CRUD for Attribute Groups (API + Admin UI)
    desc: >
      Implement create, read, update and delete for attribute groups across API and admin UI with validation, error
      handling and immediate UI reflection. Add tests for API handlers and admin pages to ensure correctness.
    source: vision
    created: '2025-08-15T15:00:00.000Z'
    priority: 1
  - type: improvement
    title: Enhance Admin Products Page with Filters & CSV Export
    desc: >
      Add search, tag and in-stock filters to the admin products page with URL-query syncing, reactive list updates, and
      a CSV export that respects current filters. Include integration tests.
    source: vision
    created: '2025-08-15T15:00:00.000Z'
    priority: 2
  - type: feature
    title: Attribute Groups Flat and Grouped Views + Export
    desc: >
      Provide flat and grouped UI views for attribute groups (expand/collapse grouped view), plus CSV export endpoints
      for both views to support auditing and offline analysis.
    source: vision
    created: '2025-08-15T15:00:00.000Z'
    priority: 3
  - type: feature
    title: Bulk Tagging Preview and Apply in Admin UI
    desc: >
      Build a bulk-tagging workflow that previews tag additions/removals for a list of SKUs before applying changes in
      batch. Include API preview endpoint and UI tests.
    source: vision
    created: '2025-08-15T15:00:00.000Z'
    priority: 4
  - type: feature
    title: Dashboard with Key Product & Tag Metrics
    desc: >
      Implement an admin dashboard surface showing total products, in-stock counts, tag usage stats and recent activity
      with API aggregation, caching and error handling.
    source: vision
    created: '2025-08-15T15:00:00.000Z'
    priority: 5
  - type: bug
    title: Query duration exceeded (long-running queries terminated)
    desc: >
      Investigate and fix long-running queries that are being terminated after the 5-minute execution cap. Actions:
      capture slow query text + EXPLAIN plans, add/migrate indexes, add filters/pagination or batched processing, and
      add safeguards (timeouts, cancellations, retries) and regression tests.
    source: logs
    created: '2025-08-15T14:09:27.960Z'
    priority: 6
```
