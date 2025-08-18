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
  - type: feature
    title: Data Quality dashboard
    desc: >
      Build a Data Quality dashboard showing completeness by channel/locale/category, rule leaderboards, heatmaps and
      drill-downs to offending products. Include API endpoints and caching for heavy aggregations.
    source: vision
    created: '2025-08-18T12:00:00.000Z'
    priority: 4
  - type: feature
    title: Global Search with advanced filters and saved views
    desc: >
      Implement global product search with attribute/tag/stock filters, sort options, URL-sync and user-saved views.
      Provide performant search API and client-side state for saved filter persistence.
    source: vision
    created: '2025-08-18T12:05:00.000Z'
    priority: 5
  - type: feature
    title: Variant Matrix Editor with bulk actions and undo
    desc: >
      Create a matrix-style variant editor that supports bulk edits across attributes, inline validation, and undo/redo
      for user actions. Ensure accessibility and performant rendering for large matrices.
    source: vision
    created: '2025-08-18T12:10:00.000Z'
    priority: 6
  - type: feature
    title: Completeness Rule Builder UI component
    desc: >
      Add a rule-builder for defining completeness/consistency rules (channel/locale-aware) with inline validation and
      quick-fix workflows that surface failing items for remediation.
    source: vision
    created: '2025-08-18T12:15:00.000Z'
    priority: 7
  - type: feature
    title: Channel Mapping UI with transformers and dry-run preview
    desc: >
      Provide a visual mapping editor from PIM attributes to channel payloads including transform snippets, field
      transformers, and a JSON dry-run preview + error explainability.
    source: vision
    created: '2025-08-18T12:20:00.000Z'
    priority: 8
  - type: feature
    title: Bulk Tagging UI + preview & apply endpoints
    desc: >
      Implement bulk-tagging with a preview step, reversible apply endpoint, conflict handling and server-side batching
      to keep large operations performant and cancelable.
    source: vision
    created: '2025-08-18T12:25:00.000Z'
    priority: 9
  - type: feature
    title: AI-assisted attribute & name suggestions improvements
    desc: >
      Improve AI suggestion endpoints and admin previews for attribute values and product naming (better prompts,
      confidence scoring, and UX affordances for accepting/suggesting changes).
    source: vision
    created: '2025-08-18T12:30:00.000Z'
    priority: 10
  - type: improvement
    title: Health & readiness endpoints with deployment checks
    desc: >
      Add comprehensive health and readiness checks (DB, cache, external adapters) and surface results on a /health
      endpoint; integrate readiness into CI/deploy pipelines.
    source: review
    created: '2025-08-18T12:35:00.000Z'
    priority: 11
  - type: improvement
    title: E2E tests for critical admin flows (export, bulk-tagging, variant generation)
    desc: >
      Add end-to-end tests covering product export, bulk-tagging preview/apply, and variant generator flows to prevent
      regressions. Include CI runners and representative fixtures for performance-sensitive scenarios.
    source: review
    created: '2025-08-18T12:40:00.000Z'
    priority: 12
```
