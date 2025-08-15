import { fetchRecentFailures } from '../server/services/failuresService';

describe('fetchRecentFailures', () => {
  test('returns items and nextCursor when more rows than page', async () => {
    const fakeRows = [] as any[];
    // create 6 rows (page size 5 + 1) newest-first
    for (let i = 0; i < 6; i++) {
      fakeRows.push({
        id: String(100 - i),
        created_at: new Date(Date.UTC(2025, 0, 1, 0, 0, 100 - i)).toISOString(),
        channel: `ch${i}`,
        job_id: `job${i}`,
        error: `err${i}`,
      });
    }

    const db = {
      query: jest.fn(async (sql: string, params?: any[]) => {
        return { rows: fakeRows };
      }),
    };

    const res = await fetchRecentFailures(db as any, 5);
    expect(res.items).toHaveLength(5);
    expect(res.nextCursor).toBeDefined();
    // cursor should reference the last returned item
    const last = res.items[res.items.length - 1];
    expect(res.nextCursor).toBe(`${last.created_at}_${last.id}`);
  });

  test('honors cursor and returns remaining rows', async () => {
    // Prepare rows such that cursor will filter out newer ones
    const rowsBeforeCursor = [
      { id: '10', created_at: '2025-08-15T12:00:10.000Z', channel: 'a', job_id: 'j1', error: 'e1' },
      { id: '9', created_at: '2025-08-15T12:00:09.000Z', channel: 'a', job_id: 'j2', error: 'e2' },
    ];

    const db = {
      query: jest.fn(async (sql: string, params?: any[]) => {
        // simple assertion that the SQL uses the cursor placeholders when provided
        if (params && params.length === 3) {
          // emulate DB returning one page exactly
          return { rows: rowsBeforeCursor };
        }
        return { rows: [] };
      }),
    };

    const cursor = `${rowsBeforeCursor[0].created_at}_${rowsBeforeCursor[0].id}`; // moves past the newest
    const res = await fetchRecentFailures(db as any, 10, cursor);
    expect(db.query).toHaveBeenCalled();
    expect(res.items).toEqual(rowsBeforeCursor);
    expect(res.nextCursor).toBeUndefined();
  });
});
