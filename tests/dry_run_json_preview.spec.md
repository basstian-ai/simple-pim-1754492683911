# Dry-Run JSON Preview — Test Specification

Purpose

This spec lists test cases and example payloads to validate Dry-Run JSON Preview behavior. Use it as a manual QA checklist or translate into automated tests for your test harness.

Test cases

1) TC-001: Basic mapping (simulate)
- Steps:
  - Provide sample product with id, title, price.
  - Use a transform that maps id -> productId, title -> name, price -> offering.price.
  - Run dry-run in simulate mode.
- Expected:
  - 200 OK response (or UI preview) with transformed fields matching mapping.
  - No errors or warnings.

2) TC-002: Missing source attribute (warning)
- Steps:
  - Provide sample without product.attributes.material.
  - Transform references product.attributes.material.
  - Run dry-run in simulate and verbose modes.
- Expected:
  - Warning: "Missing source attribute: product.attributes.material"
  - Suggestion(s) present (fallbacks, alternative mappings).

3) TC-003: Syntax error (validate-only)
- Steps:
  - Introduce a syntax mistake in the transform (e.g., unmatched brace).
  - Run dry-run validate-only.
- Expected:
  - Syntax error reported with line/column if available.
  - No attempt to run simulation.

4) TC-004: Type mismatch and validation failure
- Steps:
  - Transform produces an array where channel schema expects a string.
  - Run dry-run in simulate and validate-only.
- Expected:
  - Validation failure reported with clear explanation and path to offending field.

5) TC-005: Execution error (runtime)
- Steps:
  - Add code that triggers runtime exception (e.g., access property of undefined without guard).
  - Run simulate/verbose.
- Expected:
  - Execution error with stack trace or helpful explain output.
  - Highlight the line in the snippet causing the failure.

6) TC-006: Timeout handling
- Steps:
  - Create a transform that intentionally loops or waits beyond allowed limit.
  - Run simulate.
- Expected:
  - Dry-run aborts with a timeout error.
  - Message indicates configured timeout and suggests optimization steps.

7) TC-007: Non-persistence guarantee
- Steps:
  - Run dry-run simulate for a product that, if exported, would update downstream systems.
  - Verify no downstream side effects occur (use mocks/test integrations).
- Expected:
  - Dry-run does not persist or trigger exports.

8) TC-008: Large payload sample (graceful failure or success)
- Steps:
  - Provide a large sample near the allowed sample size limit.
  - Run simulate.
- Expected:
  - If within limits, preview completes.
  - If exceeds limits, clear error describing size limits and guidance.

Example sample payloads

- sample-basic.json
```json
{
  "id": "SKU-123",
  "title": "Classic Tee",
  "price": 19.99,
  "currency": "USD",
  "attributes": { "color": "navy", "size": "M" }
}
```

- sample-missing-attr.json
```json
{ "id": "SKU-999", "title": "Missing Material Tee", "price": 9.99 }
```

Automation hints

- If you have an API endpoint for dry-run, create automated tests that POST the sample payload and assert on status, presence/absence of errors, and JSON output shape.
- For UI testing, create end-to-end tests that open the transform editor, inject the sample, run Dry-Run, and assert the preview content and diagnostics.

Notes

- Keep a small set of canonical samples in tests/fixtures/ for repeatable testing.
- Extend this spec with additional channel-specific schema tests as mappings are added.

Checklist for merging docs

- [ ] Documentation added to docs/dry-run-json-preview.md (this PR)
- [ ] QA spec reviewed and added to tests/ (this file)
- [ ] Basic manual verification performed

If you need an executable test scaffold (mocha/jest/cypress), open a follow-up task to integrate these cases into your CI.
