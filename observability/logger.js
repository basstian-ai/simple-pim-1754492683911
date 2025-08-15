/**
 * Simple structured logger (JSON over stdout).
 * Intentionally dependency-free so it can be used in small services and tests.
 * In production you can swap this with pino/winston/structured logger while keeping the same surface.
 */

const DEFAULT_LEVELS = ["debug", "info", "warn", "error"];

function now() {
  return new Date().toISOString();
}

function createLogger(defaultContext = {}) {
  const context = Object.assign(
    {
      service: process.env.SERVICE_NAME || "pim-core",
      env: process.env.NODE_ENV || "development",
      pid: process.pid
    },
    defaultContext
  );

  function write(level, msg, meta = {}) {
    const entry = Object.assign({}, context, meta, {
      ts: now(),
      level,
      msg: String(msg)
    });
    // Ensure traceId/spanId are top-level strings if present (helpful for log ingestion)
    try {
      console.log(JSON.stringify(entry));
    } catch (err) {
      // Fallback to readable output if something non-serializable sneaks in
      console.log(
        JSON.stringify({ ts: now(), level: "error", msg: "logger serialization error", err: String(err) })
      );
    }
  }

  const logger = {};
  DEFAULT_LEVELS.forEach((lvl) => {
    logger[lvl] = (msg, meta) => write(lvl, msg, meta);
  });

  // Create a child logger that merges additional context
  logger.child = (childCtx = {}) => createLogger(Object.assign({}, context, childCtx));

  // Expose the raw context (useful for tests / telemetry correlation)
  logger._context = context;

  return logger;
}

module.exports = { createLogger };
