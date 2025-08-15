```yaml
queue:
  - id: IDEA-1755256551346
    title: Architect review batch
    details: |-
      ```yaml
      queue:
        - title: Shareable URLs for Recent Failure Feed filters
          details: Sync channel/env/time window filters to the URL and parse on load. Add a "Copy link" action to share exact views.
          created: '2025-08-15T11:05:00Z'
        - title: Auto-refresh toggle with last-updated timestamp (Failure Feed)
          details: Add 30s/60s auto-refresh with pause on background tabs. Show "Last updated" and preserve scroll during refresh.
          created: '2025-08-15T11:07:00Z'
        - title: "No matches" empty state for filtered Failure Feed
          details: Show a targeted empty state when filters return 0 results, with a Clear Filters button and quick preset chips.
          created: '2025-08-15T11:09:00Z'
        - title: Sorting controls for Recent Failure Feed
          details: Enable sort by time, channel, env; remember preference in persistence. Include accessible sort indicators.
          created: '2025-08-15T11:11:00Z'
        - title: Inline failed payload preview with PII redaction
          details: Add modal preview (first N KB) with redact rules (e.g., emails, tokens). Keep Copy/Download from the modal.
          created: '2025-08-15T11:13:00Z'
        - title: Server-side pagination and row virtualization for Failure Feed
          details: Implement cursor-based paging and virtualized list to improve performance for large feeds. Add loading skeleton rows.
          created: '2025-08-15T11:15:00Z'
        - title: Accessible feedback for quick actions (copy/copy ID)
          details: Add ARIA live region + toasts for success/failure and a clipboard API fallback for older browsers.
          created: '2025-08-15T11:17:00Z'
        - title: Preserve scroll and filter state on back from Job Details
          details: Store scroll offset and filters in history state; restore seamlessly when users navigate back to the feed.
          created: '2025-08-15T11:19:00Z'
        - title: Externalize strings for Recent Failure Feed and quick actions
          details: Move labels/tooltips/empty states to i18n resources and add locale-aware time formatting.
          created: '2025-08-15T11:21:00Z'
        - title: Unit tests for cancellable-query hook edge cases
          details: Add tests for abort mid-flight, late response handling, and last-result fallback to harden timeout UX internals.
          created: '2025-08-15T11:23:00Z'
      ```
    created: '2025-08-15T11:15:51.346Z'
```
