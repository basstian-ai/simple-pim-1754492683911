## Pull Request

<!-- Describe the change in one or two sentences -->

### Related tasks / issues
- Link any tracking task(s): e.g. `TSK-YYYYMMDD-XXX` or issue URL

### Summary of changes
- What changed, why, and any high-level design decisions.

### Checklist for author
- [ ] I linked any related tasks/issues
- [ ] I added/updated unit & integration tests where appropriate
- [ ] I added/updated documentation (user docs, developer docs)
- [ ] I updated changelog / release notes if applicable
- [ ] I verified there are no breaking API contract changes (or documented them)

### Dry-Run JSON Preview — reviewer checklist (must be addressed)
- [ ] Confirm the UI/UX matches the designs and accessibility requirements (labels, focus, ARIA, contrast)
- [ ] Confirm dry-run mode performs no outbound side effects (no network calls to external channels / production endpoints)
- [ ] Confirm preview output matches transform snippet expectations across representative inputs (include unit/fixture examples)
- [ ] Confirm error handling surface is clear and includes explainers + suggested fixes
- [ ] Confirm telemetry/instrumentation is present for preview generation (latency, errors, sample events)
- [ ] Confirm performance benchmarks for typical payload sizes and extreme cases are acceptable (or document mitigation)
- [ ] Confirm i18n/locale behavior: number/date/locale formatting and RTL if applicable
- [ ] Confirm tests cover success, failure, partial transforms, and security edge-cases (e.g., template injection)
- [ ] Confirm docs include a brief how-to and examples for maintainers and integrators

### Reviewer notes
- Focus areas (e.g., complex transform logic, security-sensitive code paths):


### Release / rollout notes
- Any special migration or rollout steps

---

Please add reviewers and request approvals from relevant teams (frontend, backend, QA, security) as needed.