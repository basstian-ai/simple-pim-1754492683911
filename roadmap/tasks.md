# Tasks (single source of truth)

```yaml
items:
  - id: TSK-1755120362204
    type: improvement
    title: Batch task synthesis
    desc: |-
      ```yaml
      items:
        - id: TSK-20250813-008
          type: bug
          title: YAML block parser should handle multiple fenced blocks per file
          desc: >-
            Current helper reads only the first ```yaml block. Update parser to support multiple named blocks or identify by
            heading context to avoid collisions.
          source: review
          created: '2025-08-13T12:13:30Z'
          priority: 1
        - id: TSK-20250813-009
          type: bug
          title: Implement step may touch unintended files without path guard tests
          desc: >-
            ALLOW_PATHS exists but lacks tests. Add allowlist enforcement tests and ensure default configuration prevents
            writes outside task scope.
          source: review
          created: '2025-08-13T12:14:00Z'
          priority: 2
        - id: TSK-20250813-002
          type: improvement
          title: Data Quality dashboard with heatmap and rule leaderboard
          desc: >-
            Expose DQ metrics per channel/locale/category; render heatmap and a 'top failing rules' leaderboard. Link each
            widget to a filtered bulk-fix view.
          source: vision
          created: '2025-08-13T12:10:30Z'
          priority: 3
        - id: TSK-20250813-003
          type: feature
          title: Global search + advanced filters + saved views
          desc: >-
            Implement global entity search (ID/SKU/attributes) and an advanced filter builder with facets (channel, locale,
            status). Add saved views with shareable URLs.
          source: vision
          created: '2025-08-13T12:11:00Z'
          priority: 4
        - id: TSK-20250813-004
          type: feature
          title: Variant matrix editor (size/color) with bulk fill/copy
          desc: >-
            Grid editing for variant attributes; support bulk copy across rows/columns and pattern fills. Persist changes
            atomically with optimistic UI + undo.
          source: vision
          created: '2025-08-13T12:11:30Z'
          priority: 5
        - id: TSK-20250813-005
          type: improvement
          title: Completeness rule builder UI (channel/locale aware)
          desc: >-
            Rule authoring for required fields, conditional requirements, and thresholds per channel/locale. Inline validation
            and preview of affected SKUs.
          source: vision
          created: '2025-08-13T12:12:00Z'
          priority: 6
        - id: TSK-20250813-006
          type: feature
          title: Channel mapping UI + field transformers + dry-run preview
          desc: >-
            Visual mapping of PIM attributes to each channel payload with transform snippets and a dry-run JSON preview prior
            to export.
          source: vision
          created: '2025-08-13T12:12:30Z'
          priority: 7
        - id: TSK-20250813-007
          type: improvement
          title: Localization workspace (side-by-side) with glossary enforcement
          desc: >-
            Side-by-side source/target editor, glossary highlighting, length checks, and 'machine suggest + human confirm'
            flow with review checklist.
          source: vision
          created: '2025-08-13T12:13:00Z'
          priority: 8
      queues:
        queue:
          - id: IDEA-20250813-001
            title: Command palette + keyboard shortcuts
            details: Quick actions (jump to product, run bulk edit, open saved view) with discoverable shortcut hints.
            created: '2025-08-13T12:15:00Z'
          - id: IDEA-20250813-002
            title: Rule-based bulk edit
            details: Apply attribute updates to a filtered set via declarative rules (if category=X and locale=Y then set Z).
            created: '2025-08-13T12:15:10Z'
          - id: IDEA-20250813-003
            title: Duplicate detection & merge assistant
            details: Detect near-duplicates via attribute similarity; guided merge with field-level picks.
            created: '2025-08-13T12:15:20Z'
          - id: IDEA-20250813-004
            title: Draft vs. published diff viewer
            details: Two-pane diff of attribute changes, assets, and relations before approve/publish.
            created: '2025-08-13T12:15:30Z'
          - id: IDEA-20250813-005
            title: Undo window for bulk operations
            details: Time-boxed revert for risky bulk edits with a summarized diff preview.
            created: '2025-08-13T12:15:40Z'
          - id: IDEA-20250813-006
            title: Virtualized DataGrid with frozen columns
            details: Smooth scrolling on 10k+ rows; allow pinning key columns and per-user column presets.
            created: '2025-08-13T12:15:50Z'
          - id: IDEA-20250813-007
            title: Inline 'Explain this error' for publish failures
            details: Contextual explanation and suggested fix steps pulled into the error row.
            created: '2025-08-13T12:16:00Z'
          - id: IDEA-20250813-008
            title: AI-assisted attribute inference from text/images
            details: Suggest missing attributes from description or image EXIF/vision cues; mark as suggested until confirmed.
            created: '2025-08-13T12:16:10Z'
          - id: IDEA-20250813-009
            title: Translation backlog aging alerts
            details: Notify when items exceed SLA by locale/category; quick-assign to translators.
            created: '2025-08-13T12:16:20Z'
          - id: IDEA-20250813-010
            title: Per-channel SLA badges
            details: Show SLA indicators (on-track/at-risk/breached) for export latency and failure rates.
            created: '2025-08-13T12:16:30Z'
      ```
    source: review
    created: '2025-08-13T21:26:02.204Z'
    priority: 10
```yaml
items:
  - id: TSK-1755116649102
    type: improvement
    title: Batch task synthesis
    desc: |-
      ```yaml
      items:
        - type: bug
          title: "YAML block parser should handle multiple fenced blocks per file"
          desc: "Current helper reads only the first ```yaml block. Update parser to support multiple named blocks or identify by heading context to avoid collisions."
          source: "review"
          created: "2025-08-13T12:13:30Z"
          priority: 1

        - type: bug
          title: "Implement step may touch unintended files without path guard tests"
          desc: "ALLOW_PATHS exists but lacks tests. Add allowlist enforcement tests and ensure default configuration prevents writes outside task scope."
          source: "review"
          created: "2025-08-13T12:14:00Z"
          priority: 2

        - type: feature
          title: "Operations Overview dashboard (KPIs + widgets)"
          desc: "Implement backend metrics endpoints and frontend cards for: pending approvals, blocked by validation, publish failures, missing assets/translations, and avg time-to-publish 7d. Include 'My queue' list and 'Publish pipeline' stage chips."
          source: "vision"
          created: "2025-08-13T12:10:00Z"
          priority: 3

        - type: improvement
          title: "Data Quality dashboard with heatmap and rule leaderboard"
          desc: "Expose DQ metrics per channel/locale/category; render heatmap and a 'top failing rules' leaderboard. Link each widget to a filtered bulk-fix view."
          source: "vision"
          created: "2025-08-13T12:10:30Z"
          priority: 4

        - type: feature
          title: "Global search + advanced filters + saved views"
          desc: "Implement global entity search (ID/SKU/attributes) and an advanced filter builder with facets (channel, locale, status). Add saved views with shareable URLs."
          source: "vision"
          created: "2025-08-13T12:11:00Z"
          priority: 5

        - type: feature
          title: "Variant matrix editor (size/color) with bulk fill/copy"
          desc: "Grid editing for variant attributes; support bulk copy across rows/columns and pattern fills. Persist changes atomically with optimistic UI + undo."
          source: "vision"
          created: "2025-08-13T12:11:30Z"
          priority: 6

        - type: improvement
          title: "Completeness rule builder UI (channel/locale aware)"
          desc: "Rule authoring for required fields, conditional requirements, and thresholds per channel/locale. Inline validation and preview of affected SKUs."
          source: "vision"
          created: "2025-08-13T12:12:00Z"
          priority: 7

        - type: feature
          title: "Channel mapping UI + field transformers + dry-run preview"
          desc: "Visual mapping of PIM attributes to each channel payload with transform snippets and a dry-run JSON preview prior to export."
          source: "vision"
          created: "2025-08-13T12:12:30Z"
          priority: 8

        - type: improvement
          title: "Localization workspace (side-by-side) with glossary enforcement"
          desc: "Side-by-side source/target editor, glossary highlighting, length checks, and 'machine suggest + human confirm' flow with review checklist."
          source: "vision"
          created: "2025-08-13T12:13:00Z"
          priority: 9

      queues:
        queue:
          - id: IDEA-20250813-001
            title: "Command palette + keyboard shortcuts"
            details: "Quick actions (jump to product, run bulk edit, open saved view) with discoverable shortcut hints."
            created: "2025-08-13T12:15:00Z"

          - id: IDEA-20250813-002
            title: "Rule-based bulk edit"
            details: "Apply attribute updates to a filtered set via declarative rules (if category=X and locale=Y then set Z)."
            created: "2025-08-13T12:15:10Z"

          - id: IDEA-20250813-003
            title: "Duplicate detection & merge assistant"
            details: "Detect near-duplicates via attribute similarity; guided merge with field-level picks."
            created: "2025-08-13T12:15:20Z"

          - id: IDEA-20250813-004
            title: "Draft vs. published diff viewer"
            details: "Two-pane diff of attribute changes, assets, and relations before approve/publish."
            created: "2025-08-13T12:15:30Z"

          - id: IDEA-20250813-005
            title: "Undo window for bulk operations"
            details: "Time-boxed revert for risky bulk edits with a summarized diff preview."
            created: "2025-08-13T12:15:40Z"

          - id: IDEA-20250813-006
            title: "Virtualized DataGrid with frozen columns"
            details: "Smooth scrolling on 10k+ rows; allow pinning key columns and per-user column presets."
            created: "2025-08-13T12:15:50Z"

          - id: IDEA-20250813-007
            title: "Inline 'Explain this error' for publish failures"
            details: "Contextual explanation and suggested fix steps pulled into the error row."
            created: "2025-08-13T12:16:00Z"

          - id: IDEA-20250813-008
            title: "AI-assisted attribute inference from text/images"
            details: "Suggest missing attributes from description or image EXIF/vision cues; mark as suggested until confirmed."
            created: "2025-08-13T12:16:10Z"

          - id: IDEA-20250813-009
            title: "Translation backlog aging alerts"
            details: "Notify when items exceed SLA by locale/category; quick-assign to translators."
            created: "2025-08-13T12:16:20Z"

          - id: IDEA-20250813-010
            title: "Per-channel SLA badges"
            details: "Show SLA indicators (on-track/at-risk/breached) for export latency and failure rates."
            created: "2025-08-13T12:16:30Z"
      ```
    source: review
    created: '2025-08-13T20:24:09.102Z'
    priority: 1
```
