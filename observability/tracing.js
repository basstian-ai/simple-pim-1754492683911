/**
 * Tiny tracing helper: implements W3C traceparent parsing and a startSpan / endSpan
 * that record timestamps and attaches trace/span ids to logs.
 * This is NOT a full OpenTelemetry implementation — it's a thin compatibility shim
 * intended to make it easy to integrate real tracers later.
 */

const crypto = require("crypto");

function genId(bytes = 8) {
  return crypto.randomBytes(bytes).toString("hex");
}

function extractTraceIdFromHeaders(headers = {}) {
  // W3C traceparent: version-traceid-spanid-flags e.g. "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01"
  const tp = headers["traceparent"] || headers["Traceparent"] || headers["x-traceparent"];
  if (!tp || typeof tp !== "string") return null;
  const parts = tp.trim().split("-");
  if (parts.length < 4) return null;
  const traceId = parts[1];
  return traceId || null;
}

class Tracer {
  constructor(logger) {
    this.logger = logger || null;
  }

  startSpan(name, opts = {}) {
    const traceId = opts.traceId || (opts.headers && extractTraceIdFromHeaders(opts.headers)) || genId(16);
    const spanId = genId(8);
    const startTs = Date.now();
    const span = { name, traceId, spanId, startTs, meta: opts.meta || {} };
    if (this.logger) {
      this.logger.debug(`span.start ${name}`, { traceId, spanId, name });
    }
    return span;
  }

  endSpan(span, result = {}) {
    const endTs = Date.now();
    const durationMs = endTs - span.startTs;
    if (this.logger) {
      this.logger.debug(`span.end ${span.name}`, {
        traceId: span.traceId,
        spanId: span.spanId,
        name: span.name,
        durationMs,
        ...result
      });
    }
    return { traceId: span.traceId, spanId: span.spanId, durationMs };
  }

  extractTraceIdFromHeaders(headers) {
    return extractTraceIdFromHeaders(headers);
  }
}

module.exports = { Tracer, extractTraceIdFromHeaders };
