/**
 * Observability exports: logger factory, a shared metrics instance and a tracer.
 * Also provides a tiny Express middleware to demonstrate request instrumentation.
 */

const { createLogger } = require("./logger");
const { Metrics } = require("./metrics");
const { Tracer } = require("./tracing");

const defaultLogger = createLogger();
const defaultMetrics = new Metrics();
const defaultTracer = new Tracer(defaultLogger);

function expressMiddleware(opts = {}) {
  const logger = (opts && opts.logger) || defaultLogger;
  const metrics = (opts && opts.metrics) || defaultMetrics;
  const tracer = (opts && opts.tracer) || defaultTracer;

  return function (req, res, next) {
    const traceId = tracer.extractTraceIdFromHeaders(req.headers) || undefined;
    const reqLog = logger.child({ traceId });
    const span = tracer.startSpan("http.request", { headers: req.headers, meta: { method: req.method, path: req.path } });

    const start = Date.now();

    // increment a simple counter for requests by method
    metrics.inc("http_requests_total", { method: req.method, route: req.route ? req.route.path : req.path });

    res.on("finish", () => {
      const duration = Date.now() - start;
      metrics.histogramObserve("http_request_duration_ms", { method: req.method, route: req.route ? req.route.path : req.path }, duration);
      metrics.inc("http_responses_total", { status: res.statusCode, method: req.method });
      tracer.endSpan(span, { status: res.statusCode, durationMs: duration });
      reqLog.info("request.finished", { method: req.method, path: req.path, status: res.statusCode, durationMs: duration });
    });

    // attach helpers to request for handlers to instrument further
    req.log = reqLog;
    req.metrics = metrics;
    req.tracer = tracer;

    if (next) next();
  };
}

module.exports = {
  createLogger,
  defaultLogger,
  Metrics,
  defaultMetrics,
  Tracer,
  defaultTracer,
  expressMiddleware
};
