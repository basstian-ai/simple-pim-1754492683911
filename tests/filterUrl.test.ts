import { encodeFiltersToParam, decodeParamToFilters } from '../src/utils/filterUrl';

describe('filterUrl utils', () => {
  test('roundtrip encodes and decodes filters', () => {
    const filters = {
      channels: ['web', 'mobile'],
      env: 'prod',
      timeWindow: '24h',
      activeFilters: { severity: ['error', 'fatal'], source: 'export' },
    } as const;

    const param = encodeFiltersToParam(filters as any);
    expect(typeof param).toBe('string');

    const decoded = decodeParamToFilters(param);
    expect(decoded).not.toBeNull();
    expect(decoded).toMatchObject(filters as any);
  });

  test('decoding invalid param returns null', () => {
    expect(decodeParamToFilters('not-a-valid-base64')).toBeNull();
    expect(decodeParamToFilters('')).toBeNull();
    expect(decodeParamToFilters(null)).toBeNull();
    expect(decodeParamToFilters(undefined)).toBeNull();
  });
});
