// Test for query duration limit exceeded

const { expect } = require('chai');
const { executeQuery } = require('../src/queryHandler');

describe('Query Duration Limit', () => {
  it('should throw an error if query exceeds duration limit', async () => {
    try {
      await executeQuery('SELECT * FROM products WHERE ...'); // Simulate long query
      throw new Error('Expected error not thrown');
    } catch (error) {
      expect(error.message).to.equal('Query duration limit exceeded');
    }
  });
});