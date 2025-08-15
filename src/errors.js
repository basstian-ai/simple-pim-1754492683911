'use strict';

class TimeoutError extends Error {
  constructor(message, meta = {}) {
    super(message);
    this.name = 'TimeoutError';
    this.isTimeout = true;
    // attach metadata for callers (attempts, perAttemptTimeout, lastError)
    Object.assign(this, meta);
  }
}

module.exports = {
  TimeoutError
};
