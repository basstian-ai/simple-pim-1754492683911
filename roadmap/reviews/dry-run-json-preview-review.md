# Dry-Run JSON Preview — Code Review Plan

Purpose

- Provide a focused, reproducible code review for the Dry-Run JSON Preview feature. The goal is to ensure correctness, safety (sandboxing / sanitization), performance, observable failures, user experience, and maintainability before merging.

Scope

- Frontend UI component(s) that render the dry-run JSON preview (editor/preview pane).
- Backend/transform runner API or worker that executes transformation snippets in dry-run mode.
- Tests, fixtures, documentation, telemetry related to the feature.

Non-goals

- Full refactors of unrelated subsystems.
- Rewriting the transform engine during this review.

Review owners

- Primary reviewer: @pim-tech-lead
- Secondary reviewers: @frontend-lead, @backend-lead, @security
- Author(s): whoever opened the PR

Timeline

- 24–48 hours for review turnaround.
- If significant changes are requested, author addresses and re-requests review.

Artifacts to include in PR

- Brief PR description summarizing feature, user-visible changes, and high-level design.
- Screenshots / short screencast for the UI preview (before/after).
- Example input product payload(s) and expected dry-run output(s) (fixtures/fixtures.md or /test/fixtures).
- Performance notes: expected complexity, observed latency numbers for representative payloads.
- Safety notes: how transform snippets are sandboxed/limited and what escapes are possible.
- Test coverage demonstrating happy path and error paths.

Checklist for reviewers (work through items and leave a :+1: or comment):

1) Correctness
- [ ] Dry-run output JSON schema matches published contract (API or docs).
- [ ] Transform snippets applied deterministically and idempotently for identical inputs.
- [ ] Edge cases covered: missing attributes, nulls, multi-locale fields, arrays, deeply nested objects.

2) Safety & Security
- [ ] Transform execution is sandboxed (no arbitrary filesystem, network, or process access).
- [ ] Inputs are sanitized and outputs are not leaking secrets or PII.
- [ ] Timeouts and memory limits are enforced; long-running transforms are interrupted gracefully.

3) UX & Accessibility
- [ ] Preview shows both compact and pretty-printed views (toggle or copy buttons).
- [ ] Clear error messages when transform fails: include minimal safe snippet of error and link to docs or explainers.
- [ ] Keyboard accessible controls; copy-to-clipboard labeled; aria-live for preview updates.

4) Observability
- [ ] Telemetry events for dry-run requests (duration, success/failure class, sample error codes).
- [ ] Structured logs include correlation id for the request.

5) Performance
- [ ] Response latency within acceptable bounds for expected payload sizes (documented in PR).
- [ ] Caching or short-circuit paths for no-op transforms considered.

6) Tests & QA
- [ ] Unit tests for transform runner and preview rendering exist and pass.
- [ ] Integration test(s) show a transform applied end-to-end (input -> transform -> preview).
- [ ] Fixtures for representative products included.

7) Docs
- [ ] README/docs updated describing usage and sample transforms.
- [ ] Migration notes if schema changed.

8) API & Contracts
- [ ] API endpoints documented; schema version bump if breaking change.
- [ ] Versioning plan for transform contract (if required).

9) Code Quality
- [ ] Code is modular and well-commented where logic is non-obvious.
- [ ] No console.* debug logs left behind.
- [ ] Appropriate tests and small surface area of changes.

10) Acceptance Criteria
- [ ] All blocking review items resolved.
- [ ] CI passes (lint, unit tests, review checks).
- [ ] Two approvers including at least one platform/infra reviewer if sandboxing/runtime changed.

How to perform the review

- Start with the PR description and artifacts. Confirm fixtures run locally if possible.
- Run local dev server and open the preview. Try sample transforms and malformed transforms.
- Run unit tests and any local integration harness.
- Verify telemetry/log entries for a sample run (if available in dev/staging).

Template comments for common issues

- "Security: Please document and/or harden the sandboxing mechanism (time, memory, syscall/file/FS/network controls) — consider running transforms in a dedicated worker with cgroup/timeout limits or using a third-party sandbox." 
- "UX: Error messages are too verbose/technical; prefer a user-friendly summary and a link to expand a technical stacktrace." 
- "Performance: For large payloads, consider streaming or truncation for preview — document where truncation occurs." 

Automated checks

- We recommend running the lightweight reviewer helper: node tools/review/dry-run-check.js
- A GitHub Actions workflow is included to run the same helper for PRs.

Post-merge

- Monitor telemetry for the first 48 hours: failure rate, latency, and error taxonomy.
- Be ready to revert or hotfix if sandbox escapes or high failure rates are observed.

Notes / housekeeping

- Do not edit roadmap/vision.md during the review; this file is a stable artifact.
- Add new items to roadmap/reviews/ if follow-up tasks are required.
