class QueryTimeoutError extends Error {
  constructor(message = 'Query timed out') {
    super(message);
    this.name = 'QueryTimeoutError';
  }
}

module.exports = { QueryTimeoutError };
