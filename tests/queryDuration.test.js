// Test for Query Duration Limit Exceeded Issue

const { expect } = require('chai');
const { fetchData } = require('../src/dataService');

describe('Query Duration Limit Tests', () => {
  it('should throw an error if query exceeds duration limit', async () => {
    try {
      await fetchData('someLongRunningQuery');
    } catch (error) {
      expect(error.message).to.equal('Query duration limit exceeded');
    }
  });
});