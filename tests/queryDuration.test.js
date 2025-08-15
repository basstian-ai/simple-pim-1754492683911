// Test for Query Duration Limit Exceeded Issue

const { expect } = require('chai');
const { queryData } = require('../src/query');

describe('Query Duration Limit', () => {
  it('should throw an error if query exceeds duration limit', async () => {
    try {
      await queryData('some_long_query'); // Simulate a long query
    } catch (error) {
      expect(error.message).to.equal('Query duration limit exceeded');
    }
  });
});