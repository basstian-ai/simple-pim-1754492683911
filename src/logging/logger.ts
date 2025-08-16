// Minimal, pluggable logger used by the query runner.
// Replace or augment with the project's structured logger as needed.

export const logger = {
  info: (...args: any[]) => {
    // Keep logs structured where possible; fallback to console.log
    try {
      console.log('[info]', ...args);
    } catch (_) {
      // noop
    }
  },
  error: (...args: any[]) => {
    try {
      console.error('[error]', ...args);
    } catch (_) {
      // noop
    }
  },
};
