const { uniqueConcat } = require('../lib/arrayUtils');

describe('uniqueConcat', () => {
  test('merges two arrays and removes duplicates preserving order', () => {
    expect(uniqueConcat([1, 2, 3], [3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    expect(uniqueConcat(['a', 'b'], ['b', 'c'])).toEqual(['a', 'b', 'c']);
  });

  test('handles empty and null inputs', () => {
    expect(uniqueConcat([], [])).toEqual([]);
    expect(uniqueConcat(null, [1, 2])).toEqual([1, 2]);
    expect(uniqueConcat([1, 2], null)).toEqual([1, 2]);
  });

  test('preserves order from first array when duplicates exist', () => {
    expect(uniqueConcat(['x', 'y', 'z'], ['y', 'x'])).toEqual(['x', 'y', 'z']);
  });

  test('works with mixed types and repeated values', () => {
    expect(uniqueConcat([1, '1', 2], ['1', 3, 2])).toEqual([1, '1', 2, 3]);
  });
});
