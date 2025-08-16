'use strict';

class UniqueConstraintError extends Error {
  constructor(message, { fields = [], suggestions = [] } = {}) {
    super(message);
    this.name = 'UniqueConstraintError';
    this.fields = fields; // e.g. ['sku', 'slug']
    this.suggestions = suggestions; // e.g. [{ field: 'slug', suggestion: 'slug-1' }]
  }
}

module.exports = {
  UniqueConstraintError,
};
