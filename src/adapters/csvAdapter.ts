import { ImportAdapter, ExportAdapter, AdapterMetadata, Product } from './types';

const meta: AdapterMetadata = {
  name: 'csv',
  adapterVersion: '1.0.0',
  schemaVersion: 'pim-product-v1',
  direction: 'both',
  description: 'Minimal CSV adapter: header-driven, simple escaping (no quoted newlines)'
};

function parseLine(line: string) {
  // very small CSV parser: splits on commas, trims quotes and spaces
  const parts = line.split(',');
  return parts.map(p => {
    let v = p.trim();
    if (v.startsWith('"') && v.endsWith('"')) {
      v = v.slice(1, -1);
    }
    return v;
  });
}

export const csvAdapter: ImportAdapter & ExportAdapter = {
  meta,
  async import(data: string | Buffer) {
    const raw = typeof data === 'string' ? data : data.toString('utf8');
    if (!raw) return [];
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return [];
    const headers = parseLine(lines[0]);
    const out: Product[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = parseLine(lines[i]);
      const p: Product = { id: '', attributes: {} };
      for (let j = 0; j < headers.length; j++) {
        const h = headers[j];
        const v = cols[j] ?? '';
        if (h.toLowerCase() === 'id') p.id = v;
        else if (h.toLowerCase() === 'title') p.title = v;
        else if (h.toLowerCase() === 'description') p.description = v;
        else if (h.toLowerCase() === 'locale') p.locale = v;
        else p.attributes![h] = v;
      }
      if (!p.id) {
        throw new Error(`CSV import: missing id on line ${i + 1}`);
      }
      out.push(p);
    }
    return out;
  },
  async export(items: Product[] | AsyncIterable<Product>) {
    // produce a simple CSV with id,title,description,locale and other attributes flattened
    const rows: Product[] = [];
    if (Symbol.asyncIterator in Object(items)) {
      for await (const it of items as AsyncIterable<Product>) rows.push(it);
    } else {
      rows.push(...(items as Product[]));
    }
    const headerSet = new Set<string>(['id', 'title', 'description', 'locale']);
    for (const r of rows) {
      if (r.attributes) {
        for (const k of Object.keys(r.attributes)) headerSet.add(k);
      }
    }
    const headers = Array.from(headerSet);
    const escape = (s: any) => {
      if (s === undefined || s === null) return '';
      const str = String(s);
      if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    const lines = [headers.join(',')];
    for (const r of rows) {
      const cols = headers.map(h => {
        if (h === 'id') return escape(r.id);
        if (h === 'title') return escape(r.title);
        if (h === 'description') return escape(r.description);
        if (h === 'locale') return escape(r.locale);
        return escape(r.attributes ? r.attributes[h] : '');
      });
      lines.push(cols.join(','));
    }
    return lines.join('\n');
  }
};
