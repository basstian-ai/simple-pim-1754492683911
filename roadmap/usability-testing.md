# Usability Testing Plan — Dashboard Widgets

Purpose

- Run lightweight moderated usability tests focused on Dashboard Widgets to surface learnability, interpretation, and actionability issues.

Scope

- Widgets: Operations Overview, Data Quality heatmap, Translation backlog, Publish Health, Saved Views UX.
- Flows: discover widget, interpret key metric(s), drill down into items, take an action (assign/flag/create saved view), use dry-run preview where applicable.
- Exclusions: deep asset management flows, import/export adapters, publish backend reliability tests.

Participants

- Target 8–12 participants total, sampling across:
  - Merchandisers (3–4)
  - Translators / Localizers (2–3)
  - Channel / Ops managers (2–3)

Recruitment

- Use internal product + customer contacts; prioritize participants who work with product catalogs or channel publish flows.
- Offer a short incentive and 45–60 minute session time.

Metrics

- SUS (System Usability Scale) after the session
- Task success rate (unassisted vs assisted)
- Time-on-task per core task
- Qualitative severity ratings for issues (P0–P3)

Logistics

- Session length: 45 minutes (30 min tasks + 10 min debrief + 5 min SUS)
- Platform: Zoom (record), optional thought-aloud. Ensure participant consent recorded.
- Facilitation: 1 moderator, 1 note-taker.

Session structure

1. Intro (5 min): purpose, consent, camera on encouraged.
2. Warm-up (3 min): background questions + tools they use.
3. Tasks (30 min): 4 core tasks from `templates/usability-session-script.md`.
4. Debrief (5–7 min): open feedback.
5. SUS (5 min): quick 10-question SUS form.

Core tasks (examples)

- Task A — Discoverability: "Find the widget or view that tells you the highest-priority items pending approval and show how you would open the list."
- Task B — Interpretation: "Look at the Data Quality heatmap for 'Footwear' category in the UK locale. What does it tell you? Which items would you prioritize?"
- Task C — Actionability & Drill-down: "From Publish Health, open the most recent failure and describe what you'd try to fix or where you'd look next."
- Task D — Efficiency & Saved Views: "Create a saved view that filters products missing translations in French and save it for your team."

Recording & data

- Record sessions, store recordings in the team's secure drive with restricted access.
- Produce redacted transcripts and anonymized notes.

Analysis & reporting

- Synthesize findings within 3 business days after last session.
- Produce a report using `templates/usability-report-template.md` containing prioritized issues, suggested fixes, and owners.

Timeline

- Prep & recruitment: 1 week
- Sessions: 1–2 weeks (depending on availability)
- Synthesis & report: 3 business days after last session

Next steps

- Create issues for highest-severity findings and link to the report.
- Schedule follow-up design reviews for fixes with the team.

(End)
