```yaml
queue:
  - id: IDEA-1755246258684
    title: Architect review batch
    details: |-
      ```yaml
      queue:
        - title: Implement CSV Import Adapter v1 (streaming + row errors)
          details: Build functional CSV importer with streaming parsing, column mapping, validation, and row-level error reporting. Persist job status with progress and summary.
          created: '2025-08-15T08:35:00Z'
        - title: Implement JSON Export Adapter v1 with Dry-Run
          details: Enable JSON export with transform hooks and integrate dry-run preview showing diff and validation messages. Support download of result on success.
          created: '2025-08-15T08:36:00Z'
        - title: Expose Adapter Registry API and Admin UI
          details: Add endpoints to list/enable/configure adapters and a simple Admin page to manage them. Show adapter name, version, status, and config form.
          created: '2025-08-15T08:37:00Z'
        - title: Build Import/Export Jobs UI (upload, config, progress)
          details: Create a user-facing Import/Export screen to pick adapter, upload/configure, start jobs, and view live progress, errors, and results.
          created: '2025-08-15T08:38:00Z'
        - title: Add E2E tests for import/export pipeline
          details: Cover CSV→Products happy path and error cases; JSON export dry-run and execute paths. Verify data persistence, metrics, and UI progress updates.
          created: '2025-08-15T08:39:00Z'
        - title: Provide sample CSV templates and mapping presets
          details: Ship example CSVs (sku,name,description,price) and ready-to-use mapping presets. Link from Import UI empty state for quick start.
          created: '2025-08-15T08:40:00Z'
        - title: Instrument export jobs into Publish Health dashboard
          details: Emit per-channel success rate, latency, and error taxonomy metrics and surface them in the Publish Health widgets with recent failure feed.
          created: '2025-08-15T08:41:00Z'
        - title: Deduplicate and close Query Duration Limit bug tickets
          details: Consolidate duplicate bug entries, link to fix commits and docs, add “Known Limit” label, and update runbook with mitigation steps.
          created: '2025-08-15T08:42:00Z'
        - title: Adapter config schema validation with auto-forms
          details: Define JSON Schema per adapter and validate at save/run; generate dynamic config forms in Admin UI with inline errors and defaults.
          created: '2025-08-15T08:43:00Z'
        - title: Add CLI commands: pim import/export
          details: Implement CLI to list adapters, dry-run, and run jobs with progress output and artifact paths, enabling engineers to automate flows.
          created: '2025-08-15T08:44:00Z'
      ```
    created: '2025-08-15T08:24:18.684Z'
```
