# Tasks (single source of truth)

```yaml
items:
  - type: feature
    title: Operations Overview dashboard (KPIs + widgets)
    desc: >-
      Implement backend metrics endpoints and frontend cards for: pending approvals, blocked by validation, publish
      failures, missing assets/translations, and avg time-to-publish 7d. Include 'My queue' list and 'Publish pipeline'
      stage chips.
    source: vision
    created: '2025-08-13T12:10:00Z'
    priority: 2
  - type: improvement
    title: Data Quality dashboard with heatmap and rule leaderboard
    desc: >-
      Expose DQ metrics per channel/locale/category; render heatmap and a 'top failing rules' leaderboard. Link each
      widget to a filtered bulk-fix view.
    source: vision
    created: '2025-08-13T12:10:30Z'
    priority: 3
  - type: feature
    title: Global search + advanced filters + saved views
    desc: >-
      Implement global entity search (ID/SKU/attributes) and an advanced filter builder with facets (channel, locale,
      status). Add saved views with shareable URLs.
    source: vision
    created: '2025-08-13T12:11:00Z'
    priority: 4
  - type: feature
    title: Variant matrix editor (size/color) with bulk fill/copy
    desc: >-
      Grid editing for variant attributes; support bulk copy across rows/columns and pattern fills. Persist changes
      atomically with optimistic UI + undo.
    source: vision
    created: '2025-08-13T12:11:30Z'
    priority: 5
  - type: improvement
    title: Completeness rule builder UI (channel/locale aware)
    desc: >-
      Rule authoring for required fields, conditional requirements, and thresholds per channel/locale. Inline validation
      and preview of affected SKUs.
    source: vision
    created: '2025-08-13T12:12:00Z'
    priority: 6
  - type: feature
    title: Channel mapping UI + field transformers + dry-run preview
    desc: >-
      Visual mapping of PIM attributes to each channel payload with transform snippets and a dry-run JSON preview prior
      to export.
    source: vision
    created: '2025-08-13T12:12:30Z'
    priority: 7
  - type: improvement
    title: Localization workspace (side-by-side) with glossary enforcement
    desc: >-
      Side-by-side source/target editor, glossary highlighting, length checks, and 'machine suggest + human confirm'
      flow with review checklist.
    source: vision
    created: '2025-08-13T12:13:00Z'
    priority: 8
```
