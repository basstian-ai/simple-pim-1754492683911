'use strict';

// Minimal test that runs the audit harness and fails the process if average
// render time exceeds 100ms. This keeps the test harness dependency-free and
// runnable in plain Node.js (no test framework required).

const assert = require('assert');
const { runAudit } = require('./run-audit');

(async () => {
  try {
    // run with a reasonable number of iterations for CI; keep runtime small
    const result = await runAudit({ iterations: 40, fetchLatencyMs: 8, renderWorkMs: 12 });
    const avgRender = result.render.avg;

    console.log('Performance assertion: average render time < 100ms');
    console.log(`avg render: ${avgRender.toFixed(2)}ms  p90: ${result.render.p90.toFixed(2)}ms`);

    // Threshold mirrors the product goal: sub-100ms perceived latency for common actions
    const thresholdMs = 100;
    assert.ok(avgRender < thresholdMs, `Average render time ${avgRender.toFixed(2)}ms >= ${thresholdMs}ms`);

    console.log('PASS: average render time is within threshold');
    process.exit(0);
  } catch (err) {
    console.error('FAIL:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
