```yaml
queue:
  - id: IDEA-1755253162583
    title: Architect review batch
    details: |-
      ```yaml
      queue:
        - title: Add deep links from Recent Failure Feed to Job Details
          details: Link each failure item to the job/run detail view with pre-selected error context. Preserve filters on back navigation.
          created: '2025-08-15T10:20:00Z'
        - title: Add channel/env filters and time window to Recent Failure Feed
          details: Add multi-select Channel/Environment filters and presets (24h, 7d, 30d). Persist selection per user.
          created: '2025-08-15T10:22:00Z'
        - title: Add quick actions to Recent Failure Feed items
          details: Enable Copy error, Copy job ID, and Download failed payload (when available) from each item’s overflow menu.
          created: '2025-08-15T10:24:00Z'
        - title: Add empty state and help link to Recent Failure Feed
          details: Show “All clear” empty state with guidance and a link to Publish Health documentation when no failures are present.
          created: '2025-08-15T10:26:00Z'
        - title: Wire QueryTimeoutBanner into Search and Reports views
          details: Use the cancellable query hook to surface the banner on timeout. Provide Retry and “narrow range” suggestions.
          created: '2025-08-15T10:28:00Z'
        - title: Externalize strings and add ARIA for QueryTimeoutBanner
          details: Move banner text to i18n; add role=alert, focus management, and keyboard handling for actions.
          created: '2025-08-15T10:30:00Z'
        - title: Add usage analytics for Timeout Banner and Failure Feed
          details: Track impressions, dismiss, retry clicks, deep-link clicks, and copy actions with event metadata for dashboards.
          created: '2025-08-15T10:32:00Z'
        - title: Add E2E tests for Failure Feed and Timeout UX
          details: Seed a failing job and validate deep-link navigation; simulate query timeout and verify banner behavior and retry.
          created: '2025-08-15T10:34:00Z'
        - title: Add feature flags for Recent Failure Feed and Timeout Banner
          details: Introduce remote-config flags for gradual rollout and per-tenant control. Include kill-switch and defaults.
          created: '2025-08-15T10:36:00Z'
        - title: Add Recent Failure Feed to default Publish Health layout
          details: Update default dashboard composition to include the widget with sensible defaults (last 24h, all channels).
          created: '2025-08-15T10:38:00Z'
        - title: Make Recent Failure Feed fully keyboard navigable
          details: Apply list semantics, roving tabindex, visible focus, and Enter/Space to open details/actions.
          created: '2025-08-15T10:40:00Z'
        - title: Seed demo data for Publish Health failures
          details: Add script to generate representative failure events for demo/staging to showcase the feed and drill-downs.
          created: '2025-08-15T10:42:00Z'
        - title: Add “Re-run export” action with permissions from Failure Feed
          details: Provide re-run button for eligible failures with role checks and audit log entry; confirm modal with context.
          created: '2025-08-15T10:44:00Z'
      ```
    created: '2025-08-15T10:19:22.583Z'
```
