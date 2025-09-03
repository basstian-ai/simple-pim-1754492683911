# ADR Template

An Architecture Decision Record (ADR) captures an important architectural or design decision made for the project, along with its context and consequences.

Use this template to create new ADR files. File names should follow the pattern: ADR-XXXX-short-title.md (where XXXX is a zero-padded sequence number).

---

Title: <short, descriptive title>

Status: {proposed | accepted | deprecated | superseded}

Date: YYYY-MM-DD

Authors: <name(s) or team>

Context

- Describe the problem or situation that requires a decision.
- Include constraints, goals, and any relevant background information.

Decision

- State the decision clearly and concretely.
- Include the chosen approach and briefly why it was selected over alternatives.

Consequences

- Positive consequences: benefits, how this helps meet goals.
- Negative consequences: risks, trade-offs, what this rules out.
- Operational notes: tasks or follow-up work needed to implement this decision.

References

- Links, RFCs, docs, or other ADRs referenced.

Related ADRs

- ADR-XXXX - Short title (if applicable)

---

Guidelines

- Keep ADRs small and focused: one decision per file.
- Capture enough context that someone new to the project can understand the rationale.
- Update status if the decision changes; if superseded, reference the replacing ADR.
