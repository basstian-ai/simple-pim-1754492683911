import { formatDryRunError } from "../src/utils/dryRunError";

describe("formatDryRunError", () => {
  test("formats AJV-like validation errors", () => {
    const err = { name: "ValidationError", errors: [{ instancePath: "/title", message: "must be string" }, { instancePath: "/price", message: "must be >= 0" }] } as any;
    const out = formatDryRunError(err);
    expect(out.title).toMatch(/Schema validation failed/);
    expect(out.details).toMatch(/\/title/);
    expect(out.details).toMatch(/\/price/);
    expect(out.suggestion).toMatch(/required fields/);
  });

  test("formats JSON syntax errors", () => {
    const err = new SyntaxError("Unexpected token } in JSON at position 123");
    const out = formatDryRunError(err, { payloadPreview: '{"a": 1,}' });
    expect(out.title).toMatch(/Invalid JSON produced/);
    expect(out.details).toMatch(/Unexpected token/);
    expect(out.suggestion).toMatch(/trailing commas/);
  });

  test("formats runtime TypeError", () => {
    const err = new TypeError("Cannot read property 'name' of undefined");
    const out = formatDryRunError(err);
    expect(out.title).toMatch(/Transform runtime error/);
    expect(out.details).toMatch(/Cannot read property/);
    expect(out.suggestion).toMatch(/optional chaining/);
  });

  test("formats network adapter error by code", () => {
    const err = { message: "connect ECONNREFUSED 127.0.0.1:8080", code: "ECONNREFUSED" } as any;
    const out = formatDryRunError(err);
    expect(out.title).toMatch(/Adapter \/ network error/);
    expect(out.suggestion).toMatch(/Retry the dry-run/);
  });

  test("fallbacks for unknown errors", () => {
    const err = { message: "something exploded" } as any;
    const out = formatDryRunError(err);
    expect(out.title).toMatch(/Dry-run failed/);
    expect(out.details).toMatch(/something exploded/);
  });
});
