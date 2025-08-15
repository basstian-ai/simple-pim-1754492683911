export type Locale = string;

export interface Product {
  id: string;
  title?: string;
  description?: string;
  locale?: Locale;
  attributes?: Record<string, any>;
}

export type AdapterDirection = 'import' | 'export' | 'both';

export interface AdapterMetadata {
  /** Logical adapter name, e.g. "csv", "json", "shopify-export" */
  name: string;
  /** Adapter implementation version (semver-ish string) */
  adapterVersion: string;
  /** Schema version that this adapter expects/produces (optional) */
  schemaVersion?: string;
  direction: AdapterDirection;
  description?: string;
}

export interface ImportAdapter {
  meta: AdapterMetadata;
  /**
   * Import input is a string or Buffer (file contents). Returns a list of products.
   * Implementations should be resilient and return a deterministic error on invalid input.
   */
  import(data: string | Buffer): Promise<Product[]>;
}

export interface ExportAdapter {
  meta: AdapterMetadata;
  /**
   * Export list of products to a string or Buffer (file contents).
   */
  export(items: Product[] | AsyncIterable<Product>): Promise<string | Buffer>;
}
