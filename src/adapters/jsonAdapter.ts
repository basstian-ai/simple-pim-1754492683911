import { ImportAdapter, ExportAdapter, AdapterMetadata, Product } from './types';

const meta: AdapterMetadata = {
  name: 'json',
  adapterVersion: '1.0.0',
  schemaVersion: 'pim-product-v1',
  direction: 'both',
  description: 'JSON adapter: expects/produces an array of product objects.'
};

export const jsonAdapter: ImportAdapter & ExportAdapter = {
  meta,
  async import(data: string | Buffer) {
    const raw = typeof data === 'string' ? data : data.toString('utf8');
    if (!raw) return [];
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      throw new Error('JSON import: parse error - ' + (err as Error).message);
    }
    if (!Array.isArray(parsed)) {
      throw new Error('JSON import: expected an array of products');
    }
    // Basic validation: ensure id exists
    const out: Product[] = parsed.map((p: any, idx: number) => {
      if (!p || typeof p !== 'object') throw new Error(`JSON import: invalid product at index ${idx}`);
      if (!p.id) throw new Error(`JSON import: missing id at index ${idx}`);
      return {
        id: String(p.id),
        title: p.title,
        description: p.description,
        locale: p.locale,
        attributes: p.attributes || {}
      } as Product;
    });
    return out;
  },
  async export(items: Product[] | AsyncIterable<Product>) {
    const out: Product[] = [];
    if (Symbol.asyncIterator in Object(items)) {
      for await (const it of items as AsyncIterable<Product>) out.push(it);
    } else {
      out.push(...(items as Product[]));
    }
    return JSON.stringify(out, null, 2);
  }
};
