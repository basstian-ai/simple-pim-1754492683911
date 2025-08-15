# Dry-Run JSON Preview — Code Review Checklist

Purpose: provide a concise checklist for reviewers to ensure the Dry-Run JSON Preview feature is high-quality, safe, and maintainable.

Scope: covers UI, backend dry-run safety, transform correctness, observability, performance, security, accessibility, and documentation.

1) High-level
- [ ] Does the change include a clear description and motivation (in PR/issue)?
- [ ] Has the author included representative inputs/fixtures for transforms?
- [ ] Are tests and CI green? Are there new tests for the feature?

2) Dry-run Safety
- [ ] Verify the implementation of "dry-run" guarantees: it must not send/commit data to external systems or mutate production state.
- [ ] Confirm any adapters used during preview are stubbed/mocked and cannot leak credentials or invoke network calls by default.

3) Transform Correctness
- [ ] Confirm the JSON preview matches expected outputs for sample inputs (include edge cases: missing attributes, nulls, arrays, nested objects).
- [ ] Check rounding/truncation/locale formatting logic used in transforms.
- [ ] Validate behavior when transform snippets throw errors: the preview must surface helpful diagnostics without crashing.

4) UX & Accessibility
- [ ] Visual layout: preview is readable (monospace, syntax highlighting if present), scroll/resize behavior is sensible.
- [ ] Keyboard accessibility: can open/close preview, copy output, navigate without a mouse.
- [ ] Screen reader: preview is announced appropriately; use ARIA roles/labels where necessary.

5) Observability & Telemetry
- [ ] Events: preview requested, preview success/failure, preview duration (latency).
- [ ] Logs: structured, contain correlation IDs where relevant, avoid logging sensitive payloads.
- [ ] Metrics: ensure high-latency or error-rate regressions can be detected.

6) Performance
- [ ] Confirm the preview generation is performant for common cases; document or gate for very large inputs.
- [ ] Ensure previews are cancelable if generation is long-running.

7) Security
- [ ] Input sanitization: ensure transform engine does not allow arbitrary code execution (no eval with user-supplied templates unless sandboxed).
- [ ] Secrets handling: confirm no secrets are embedded in preview responses or logs.
- [ ] Template injection and denial-of-service considerations addressed.

8) Testing
- [ ] Unit tests cover transform snippets, including error paths.
- [ ] Integration tests cover the end-to-end preview generation flow (stubbed adapters).
- [ ] Regression tests exist for previously reported bugs fixed by this change.

9) Documentation
- [ ] Developer docs: explain transform snippet runtime, sandboxing, and how to add fixtures/tests.
- [ ] User docs: how to use Dry-Run JSON Preview, limitations, and examples.

10) Rollout & Backwards Compatibility
- [ ] If this changes API contracts or persisted data, are migrations or feature flags in place?
- [ ] Is there a plan to roll out (gradual enablement, feature flag, or opt-in)?

11) Final sign-offs
- [ ] Frontend lead / design
- [ ] Backend / infra (for sandboxing and performance)
- [ ] Security reviewer
- [ ] QA

Notes / evidence section (attach screenshots, traces, sample payloads, perf numbers):


