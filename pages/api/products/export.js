import { getProducts } from '../../../lib/products';
import * as csvModule from '../../../lib/exportCsv';

function pickCsvFn(mod) {
  if (!mod) return null;
  if (typeof mod === 'function') return mod;
  if (typeof mod.default === 'function') return mod.default;
  if (typeof mod.exportCsv === 'function') return mod.exportCsv;
  if (typeof mod.toCsv === 'function') return mod.toCsv;
  if (typeof mod.exportProductsToCsv === 'function') return mod.exportProductsToCsv;
  return null;
}

function csvEscape(val) {
  if (val == null) return '';
  const str = String(val);
  if (/[",\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function defaultCsv(products = []) {
  const rows = Array.isArray(products) ? products : [];
  // Collect column names from all objects to have a stable header
  const colsSet = new Set();
  rows.forEach((p) => Object.keys(p || {}).forEach((k) => colsSet.add(k)));
  const cols = Array.from(colsSet);
  if (cols.length === 0) return '';
  const header = cols.join(',');
  const body = rows
    .map((p) => cols.map((c) => csvEscape(p[c])).join(','))
    .join('\n');
  return header + '\n' + body + '\n';
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const products = await getProducts({});
  const toCsv = pickCsvFn(csvModule) || defaultCsv;

  let csv;
  try {
    csv = toCsv(products);
  } catch (e) {
    csv = defaultCsv(products);
  }

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
  res.status(200).send(csv);
}
