const { runQueryWithTimeout } = require('../src/db/queryRunner');
const { QueryTimeoutError } = require('../src/errors');

describe('runQueryWithTimeout', () => {
  test('times out and captures explain and calls cancel', async () => {
    const explainMock = jest.fn().mockResolvedValue('EXPLAIN PLAN');
    let cancelCalled = false;

    const executor = {
      execute: () => new Promise(resolve => setTimeout(() => resolve('OK'), 1000)),
      cancel: () => { cancelCalled = true; },
      explain: explainMock,
    };

    await expect(runQueryWithTimeout(executor, { timeoutMs: 50 }))
      .rejects.toMatchObject({ name: 'QueryTimeoutError' });

    expect(explainMock).toHaveBeenCalled();
    expect(cancelCalled).toBe(true);
  });

  test('returns result when fast and does not call explain', async () => {
    const explainMock = jest.fn();
    const executor = {
      execute: () => Promise.resolve('quick'),
      explain: explainMock,
    };

    const res = await runQueryWithTimeout(executor, { timeoutMs: 1000 });
    expect(res).toBe('quick');
    expect(explainMock).not.toHaveBeenCalled();
  });
});
