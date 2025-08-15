```yaml
queue:
  - id: IDEA-1755261313127
    title: Architect review batch
    details: |-
      ```yaml
      queue:
        - title: Add drill-down from RetryMetricsPanel to filtered Failure Feed
          details: Clicking a bar opens Recent Failure Feed pre-filtered by channel/env/time range. Include hover tooltips with counts and error-rate %.
          created: '2025-08-15T12:58:00Z'
        - title: Global time range selector for Publish Health (with URL state)
          details: Add a unified time range control (Last 1h, 24h, 7d) that syncs to URL and drives all widgets (RetryMetrics, Failure Feed). Show "Last updated" timestamp.
          created: '2025-08-15T12:59:00Z'
        - title: Export Recent Failure Feed to CSV (respects filters)
          details: Add an Export CSV action that downloads the current feed rows using active filters/sorts. Include permission checks and a success/error toast.
          created: '2025-08-15T13:00:00Z'
        - title: Environment switcher for Publish Health dashboard
          details: Add Prod/Staging/All environment tabs that update all widgets consistently. Persist user preference and reflect in URL.
          created: '2025-08-15T13:01:00Z'
        - title: Feature flag for RetryMetricsPanel rollout
          details: Gate RetryMetricsPanel behind remote-config with per-tenant rollout and kill switch. Default off for new tenants.
          created: '2025-08-15T13:02:00Z'
        - title: Make RetryMetricsPanel keyboard and screen-reader accessible
          details: Ensure bars are focusable with ARIA labels announcing channel and retry rate; provide visible focus states and Enter/Space activation.
          created: '2025-08-15T13:03:00Z'
        - title: Add "How retry rate is calculated" info popover
          details: Provide an inline help icon on RetryMetricsPanel explaining metric definitions, with a link to docs. Copy/i18n-ready.
          created: '2025-08-15T13:04:00Z'
        - title: Show recent failures badge in navigation
          details: Display a badge on Publish Health nav item showing failures in the last hour with color coding; clicking navigates to Failure Feed filtered accordingly.
          created: '2025-08-15T13:05:00Z'
      ```
    created: '2025-08-15T12:35:13.127Z'
```
