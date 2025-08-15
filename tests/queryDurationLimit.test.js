const { expect } = require('chai');
const { handleQuery } = require('../src/queryHandler');

describe('Query Duration Limit Tests', () => {
  it('should handle query duration limit exceeded gracefully', async () => {
    const result = await handleQuery('some long running query');
    expect(result).to.have.property('error');
    expect(result.error).to.equal('Query duration limit exceeded.');
  });
});