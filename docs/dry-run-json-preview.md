# Dry-Run JSON Preview

Purpose

The Dry-Run JSON Preview helps users validate and inspect the output of transform snippets (mapping / shaping / enrichment logic) without executing a real export or persisting changes. It provides quick feedback about the transformed payload, highlights errors, explains validation failures, and supports safe iteration before you map data to a channel.

When to use

- Validate a transform snippet before saving or publishing.
- Inspect how attributes map to a channel payload for a single product or a small sample.
- Debug mapping issues (missing attributes, type mismatches, unexpected nulls).
- Demonstrate and review transformations with stakeholders without affecting production data.

Modes

- validate-only — Run only static/semantic checks on the snippet (syntax, schema conformance). No sample payload transformation.
- simulate — Run the snippet against a provided sample product JSON and return the transformed payload.
- verbose (simulate + explain) — Include transformation steps, intermediate values, and helpful explainers for each field.

Where to find it

- UI: Open the Transform editor for a channel mapping and click the "Dry-Run" button. Choose a mode and provide a sample product (or pick from recent items).
- CLI / API: Available as a non-persistent endpoint for preview workflows (see API examples).

Step-by-step (UI)

1. Open the channel mapping or transform snippet you want to test.
2. Click "Dry-Run".
3. Choose a mode (validate-only / simulate / verbose).
4. Provide a sample product JSON (paste, upload, or pick from catalog).
5. Run dry-run. The preview panel shows:
   - Resulting JSON payload (pretty-printed)
   - Field-level errors or warnings with suggestions
   - A small diff / path mapping back to original attributes (in verbose mode)
6. Iterate on the snippet and re-run until satisfied, then save the transform or run an actual export.

Examples

Example 1 — Simple field mapping

Input product (sample):

```json
{
  "id": "SKU-123",
  "title": "Classic Tee",
  "price": 19.99,
  "currency": "USD",
  "attributes": {
    "color": "navy",
    "size": "M"
  }
}
```

Transform snippet (pseudo-JS):

```js
return {
  productId: product.id,
  name: product.title,
  offering: {
    price: product.price,
    currency: product.currency
  },
  metadata: {
    color: product.attributes.color,
    size: product.attributes.size
  }
}
```

Dry-run (simulate) expected payload:

```json
{
  "productId": "SKU-123",
  "name": "Classic Tee",
  "offering": { "price": 19.99, "currency": "USD" },
  "metadata": { "color": "navy", "size": "M" }
}
```

Example 2 — Error and quick-fix

If the transform references product.attributes.material but the sample is missing that attribute, the dry-run will emit a warning or error depending on rule severity.

Error shown:

- "Missing source attribute: product.attributes.material"

Quick-fix suggestions (UI):

- Use fallback: product.attributes.material || "unknown"
- Map from an alternative source attribute
- Make the field optional in the target schema

Error taxonomy and messages

- Syntax Error — The snippet could not be parsed. Fix: check code and line numbers in the error panel.
- Missing Source Attribute — The transform references a field not present in sample. Fix: provide sample containing attribute or use fallbacks.
- Type Mismatch — The target expects a string but transform produced an object/array. Fix: coerce type or update mapping.
- Validation Failure — Resulting payload violates channel schema (required field missing, invalid enum, etc.). Fix: adjust transform or sample.
- Execution Error — Runtime exception while running the snippet. Fix: inspect stacktrace/explain output.

Limits & performance

- Sample size: The dry-run preview is intended for single items or small sample sets. For large-batch simulations, use the dedicated preview job (if available) or run transforms locally.
- Timeout: Transform executions in dry-run honor a short timeout (e.g., 2s–5s). Long-running transforms will be aborted and reported as timeout errors.
- Side effects: Dry-run never persists data or triggers downstream exports. It runs in a sandboxed environment.

Security & permissions

- Only users with permission to view or edit transforms can run dry-runs for that transform.
- Samples containing PII should be handled per your org policy. Dry-run logs are retained according to retention and audit policy.

API / CLI examples

Note: the actual API path and authentication details depend on your deployment. The examples below show the typical contract. Replace host, token, and endpoint as required.

Example curl (simulate):

```bash
curl -X POST https://pim.example.com/api/v1/transforms/dry-run \
  -H "Authorization: Bearer $PIM_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "simulate",
    "transformId": "transform-abc",
    "sample": { "id": "SKU-123", "title": "Classic Tee", "price": 19.99 }
  }'
```

Expected response (200):

```json
{
  "status": "ok",
  "mode": "simulate",
  "result": { "productId": "SKU-123", "name": "Classic Tee", "offering": { "price": 19.99 } },
  "warnings": [],
  "errors": []
}
```

If validate-only mode is used, result may be omitted and the response will contain only diagnostics.

Troubleshooting

- I see a timeout: reduce complexity of the snippet, use smaller helper functions, or test locally. Check for accidental network calls or heavy loops.
- I get a syntax error but code looks fine: ensure the editor language/runner supports the syntax (e.g., don't use top-level await if not supported).
- Transform behaves differently on dry-run vs export: compare the sample used in dry-run with a real product payload. Differences in normalization (e.g., enriched fields) can cause divergence.

Tips & best practices

- Start with validate-only to catch obvious syntax/schema issues.
- Use verbose mode to understand intermediate values and where a mapping goes wrong.
- Keep transform snippets small and test with multiple representative samples (edge cases: missing attributes, wrong types, plural forms).
- Use fallbacks and explicit coercions to make transforms robust: e.g., product.price ? Number(product.price) : null
- Document transforms with short descriptions and examples inside the transform editor to make dry-runs reproducible.

QA checklist (before saving a transform)

- [ ] Dry-run (validate-only) succeeds without syntax errors.
- [ ] Dry-run (simulate) for 3 representative samples produces expected payloads.
- [ ] No unhandled runtime errors or timeouts in verbose mode.
- [ ] Field-level validation warnings resolved or acknowledged.
- [ ] Changes documented and owner assigned for future maintenance.

Change log

- v1.0 — Initial documentation for Dry-Run JSON Preview (modes, examples, API samples, troubleshooting).

If you find missing information or need a concrete API contract for automation, open a short documentation task in roadmap/new.md referencing this file.