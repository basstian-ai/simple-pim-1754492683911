# Performance Audit: Dashboard Widgets

This audit contains a lightweight, reproducible harness to measure dashboard widget performance (data-fetch + render simulation), example test assertions, and recommendations.

Goals
- Measure representative fetch + render times for widgets.
- Provide a repeatable baseline.
- Surface low-effort optimizations (caching, virtualization, batching, memoization).
- Produce artifacts that can be iterated on and used in CI.

Files
- run-audit.js — microbenchmark harness (Node) that simulates async data fetch and synchronous render work and returns timing metrics.
- perf.spec.js — a small assertion script that runs the harness and fails if average render time exceeds 100ms.

How it works
- The harness runs N iterations of: simulate async fetch (tick), process data, run a CPU-bound render simulation. It records fetch and render durations and reports averages and percentiles.

How to run
- From the repo root:
  - node audits/performance-dashboard-widgets/run-audit.js
  - node audits/performance-dashboard-widgets/perf.spec.js

Recommendations (first pass)
- Cache API responses for frequent identical queries (time-based TTL or ETag-based).
- Implement virtualization for lists/grids (render only visible rows/cells).
- Batch multiple small requests into a single query when possible.
- Memoize pure render result computations (selectors, derived data).
- Use debounced/idle scheduling for low-priority updates.
- Instrument real widgets with user-facing metrics (RUM) and compare to synthetic baselines.

Deliverables
- This harness (for CI / local baseline runs).
- Markdown notes with recommended quick wins and PRs to apply them.

