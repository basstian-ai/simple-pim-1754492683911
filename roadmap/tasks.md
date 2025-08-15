# Tasks (single source of truth)

```yaml
items:
  - type: improvement
    title: Filtered CSV Export for Products
    desc: >
      Ensure product CSV export respects current list filters (search, tags, in-stock) and pagination. Update export
      endpoints, admin export link behavior and add tests to validate CSV contents match applied filters.
    source: vision
    created: '2025-08-15T15:00:02.000Z'
    priority: 1
  - type: feature
    title: Bulk Tagging Preview and Apply in Admin UI
    desc: >
      Build a bulk-tagging workflow that previews tag additions/removals for a list of SKUs before applying changes in
      batch. Include API preview endpoint and UI tests.
    source: vision
    created: '2025-08-15T15:00:00.000Z'
    priority: 2
  - type: feature
    title: Dashboard with Key Product & Tag Metrics
    desc: >
      Implement an admin dashboard surface showing total products, in-stock counts, tag usage stats and recent activity
      with API aggregation, caching and error handling.
    source: vision
    created: '2025-08-15T15:00:00.000Z'
    priority: 3
  - type: bug
    title: Query duration exceeded (long-running queries terminated)
    desc: >
      Investigate and fix long-running queries that are being terminated after the 5-minute execution cap. Actions:
      capture slow query text + EXPLAIN plans, add/migrate indexes, add filters/pagination or batched processing, and
      add safeguards (timeouts, cancellations, retries) and regression tests.
    source: logs
    created: '2025-08-15T14:09:27.960Z'
    priority: 4
  - type: improvement
    title: Attribute Groups Search (filters & pagination)
    desc: >
      Provide searchable API and admin UI for attribute groups with filters (code, label, type, required) and
      server-side pagination. Include robust error handling, API + UI tests and documentation updates.
    source: vision
    created: '2025-08-15T15:33:27.457Z'
    priority: 5
```
