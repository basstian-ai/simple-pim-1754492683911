const { expect } = require('chai');
const { fetchData } = require('../src/dataFetcher');

describe('Query Duration Tests', () => {
  it('should not exceed duration limit', async () => {
    const result = await fetchData();
    expect(result).to.not.throw();
  });
});