# Code Review Session — Dry-Run JSON Preview

Purpose: run a focused review meeting to triage any remaining concerns before merging the Dry-Run JSON Preview feature.

Duration: 45 minutes (suggested)

Attendees:
- Feature author (required)
- Frontend reviewer (required)
- Backend/infra reviewer (required)
- Security reviewer (optional but recommended)
- QA (optional)
- Product owner/stakeholder (optional)

Agenda:
1. 5m — Quick context & demo by author (show transform snippets + dry-run preview)  
2. 10m — Walk through high-risk code paths (dry-run safety, sandboxing, template engine)  
3. 10m — UX/accessibility review (design + a11y checks)  
4. 10m — Observability & performance (metrics, logs, workspace impact)  
5. 5m — Action items & owners (tests to add, docs to improve, follow-ups)  
6. 5m — Approvals & next steps (merge strategy, feature flagging)

Pre-reads (attach links):
- PR link
- Design mocks
- Performance traces or benchmark notes
- Test run results

Artifacts to produce during the meeting:
- List of follow-up tasks (with owners)
- Required test cases to add
- Any rollback or gating plan

Outcome: either merge-ready with checklist satisfied or a clear action plan to reach merge readiness.
