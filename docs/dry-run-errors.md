# Dry-Run JSON Preview — Error Message Guide

This short doc explains common error classes surfaced in the Dry-Run JSON Preview and suggested user actions.

- Schema validation errors
  - What: The output is valid JSON but does not satisfy the expected schema (missing fields, wrong types).
  - Fix: Inspect listed paths, add missing fields, or update the transform to emit the correct types.

- Invalid JSON / SyntaxError
  - What: The transform produced invalid JSON (e.g., trailing commas, functions, unescaped quotes).
  - Fix: Ensure the transform returns JSON-serializable values. Use JSON.stringify in the transform or run the output through a linter.

- Transform runtime errors (TypeError, ReferenceError)
  - What: The transform tried to access a property on undefined or invoked a missing function.
  - Fix: Add guards (optional chaining ?.), default values, or null checks for optional fields.

- Adapter / Network errors
  - What: External services (adapters) failed or are unreachable.
  - Fix: Check credentials, network access, and the external service status. Retry the operation.

- Generic / unknown
  - If the UI cannot map an error to the above, collect the payload and error details and open a ticket with the support team.

For more troubleshooting steps, visit: https://docs.example.com/pim/dry-run-json-preview#error-messages
