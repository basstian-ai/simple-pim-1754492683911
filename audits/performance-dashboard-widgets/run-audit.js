'use strict';

const { performance } = require('perf_hooks');

// Lightweight harness that simulates an async data fetch + CPU-bound "render" work
// and reports timing metrics. It is intentionally conservative/simple so it can
// run in CI without external dependencies.

function busyWork(ms) {
  // Busy-wait loop to simulate synchronous render work for ~ms milliseconds.
  const start = performance.now();
  while (performance.now() - start < ms) {
    // do a few math ops to prevent extreme CPU optimizations
    Math.sqrt(Math.random() * 1e6);
  }
}

function simulateFetch(latencyMs) {
  // Simulate an asynchronous fetch with given latency using setTimeout wrapped in a Promise
  return new Promise((resolve) => setTimeout(() => resolve({ items: new Array(50).fill(0).map(() => Math.random()) }), latencyMs));
}

async function runIteration(opts) {
  const fetchStart = performance.now();
  const data = await simulateFetch(opts.fetchLatencyMs);
  const fetchEnd = performance.now();

  const renderStart = performance.now();
  // Derive something from the data to simulate processing + render work
  // The amount of busy work is proportional to data size and a configured renderWorkMs.
  const derived = data.items.reduce((acc, v) => acc + v, 0);
  // Make sure derived is used so it's not optimized away
  if (typeof derived !== 'number') throw new Error('unexpected derived');

  busyWork(opts.renderWorkMs);
  const renderEnd = performance.now();

  return {
    fetchMs: fetchEnd - fetchStart,
    renderMs: renderEnd - renderStart
  };
}

async function runAudit(opts = {}) {
  const defaultOpts = {
    iterations: 50,
    fetchLatencyMs: 8, // simulate ~8ms network/db latency per widget
    renderWorkMs: 12  // simulate ~12ms CPU-bound render work per widget
  };
  opts = Object.assign({}, defaultOpts, opts);

  const fetchTimes = [];
  const renderTimes = [];

  // Warmup
  await runIteration(opts);

  for (let i = 0; i < opts.iterations; i++) {
    // allow other tasks to proceed between iterations
    await new Promise((r) => setImmediate(r));
    const r = await runIteration(opts);
    fetchTimes.push(r.fetchMs);
    renderTimes.push(r.renderMs);
  }

  function stats(arr) {
    const sorted = arr.slice().sort((a, b) => a - b);
    const sum = arr.reduce((s, v) => s + v, 0);
    const avg = sum / arr.length;
    const p50 = sorted[Math.floor(arr.length * 0.5)];
    const p90 = sorted[Math.floor(arr.length * 0.9)];
    const p95 = sorted[Math.floor(arr.length * 0.95)];
    return { avg, p50, p90, p95 };
  }

  const result = {
    iterations: opts.iterations,
    fetch: stats(fetchTimes),
    render: stats(renderTimes),
    raw: { fetchTimes, renderTimes }
  };

  return result;
}

// If run directly, print a human readable summary
if (require.main === module) {
  (async () => {
    const res = await runAudit();
    console.log('Dashboard widget microbenchmark (simulated)');
    console.log(`iterations: ${res.iterations}`);
    console.log(`fetch avg: ${res.fetch.avg.toFixed(2)}ms  p90: ${res.fetch.p90.toFixed(2)}ms`);
    console.log(`render avg: ${res.render.avg.toFixed(2)}ms  p90: ${res.render.p90.toFixed(2)}ms`);
    console.log('Note: This is a synthetic harness. Use real RUM + instrumentation for production baselines.');
  })();
}

module.exports = { runAudit };
