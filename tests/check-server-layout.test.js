// tests/check-server-layout.test.js
// Lightweight test that integrates with typical JS test harnesses (jest/mocha).
// It will fail if both server/ and src/server/ exist.
const { checkLayout } = require('../scripts/check-server-layout');

describe('server layout consistency', () => {
  test('does not contain both server/ and src/server/', () => {
    expect(() => checkLayout()).not.toThrow();
  });
});
