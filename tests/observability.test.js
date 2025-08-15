/*
 * Minimal tests for the observability helpers. Run with `node test/observability.test.js`.
 * No test framework required; uses Node's assert.
 */

const assert = require("assert");
const { createLogger } = require("../observability/logger");
const { Metrics } = require("../observability/metrics");
const { Tracer, extractTraceIdFromHeaders } = require("../observability/tracing");

function captureConsole(fn) {
  const orig = console.log;
  const out = [];
  console.log = (...args) => out.push(args.join(" "));
  try {
    fn();
  } finally {
    console.log = orig;
  }
  return out.join("\n");
}

// Logger test
(function testLoggerJson() {
  const logger = createLogger({ service: "test-service" });
  const output = captureConsole(() => logger.info("hello", { foo: "bar" }));
  // should be a single JSON line containing expected fields
  let parsed;
  try {
    parsed = JSON.parse(output.trim());
  } catch (err) {
    console.error("Failed to parse logger output:", output);
    throw err;
  }
  assert.strictEqual(parsed.service, "test-service");
  assert.strictEqual(parsed.level, "info");
  assert.strictEqual(parsed.msg, "hello");
  assert.strictEqual(parsed.foo, "bar");
  console.log("ok - logger JSON output");
})();

// Metrics test
(function testMetricsExposition() {
  const m = new Metrics();
  m.inc("jobs_processed_total", { worker: "A" }, 2);
  m.gaugeSet("inflight_jobs", { worker: "A" }, 5);
  m.histogramObserve("job_duration_ms", { worker: "A" }, 123);
  m.histogramObserve("job_duration_ms", { worker: "A" }, 77);
  const expo = m.exposition();
  assert.ok(expo.includes("jobs_processed_total{worker=\"A\"}"), "counter line exists");
  assert.ok(expo.includes("inflight_jobs{worker=\"A\"}"), "gauge line exists");
  assert.ok(expo.includes("job_duration_ms_sum"), "histogram sum exists");
  assert.ok(expo.includes("job_duration_ms_count"), "histogram count exists");
  console.log("ok - metrics exposition");
})();

// Tracing test
(function testTracing() {
  const tracer = new Tracer(createLogger({ service: "trace-test" }));
  const fakeHeaders = { traceparent: "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01" };
  const traceId = extractTraceIdFromHeaders(fakeHeaders);
  assert.strictEqual(traceId, "4bf92f3577b34da6a3ce929d0e0e4736");

  // start/end span should return durations and keep traceId
  const span = tracer.startSpan("unit.test", { headers: fakeHeaders });
  // simulate some work
  for (let i = 0; i < 10000; i++); // noop
  const res = tracer.endSpan(span, { ok: true });
  assert.strictEqual(res.traceId, span.traceId);
  assert.ok(res.durationMs >= 0);
  console.log("ok - tracing start/end");
})();

console.log("All observability tests passed.");
