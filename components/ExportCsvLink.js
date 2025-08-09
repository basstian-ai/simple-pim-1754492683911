import React from 'react';

export default function ExportCsvLink({ href = '/api/products/export', className, style }) {
  return (
    <a
      href={href}
      className={className}
      style={style}
      aria-label="Export CSV"
      data-testid="export-csv-link"
    >
      Export CSV
    </a>
  );
}
