// Test for Query Duration Limit Exceeded issue

const { expect } = require('chai');
const { queryData } = require('../src/query');

describe('Query Duration Limit', () => {
  it('should throw an error if query exceeds duration limit', async () => {
    try {
      await queryData({ duration: 6 * 60 * 1000 }); // 6 minutes
    } catch (error) {
      expect(error.message).to.equal('Query Duration Limit Exceeded');
    }
  });
});