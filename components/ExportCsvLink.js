import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

function buildExportHref(query) {
  const allowed = ['search', 'tags', 'inStock'];
  const params = new URLSearchParams();
  for (const key of allowed) {
    const val = query?.[key];
    if (val != null && val !== '' && !(Array.isArray(val) && val.length === 0)) {
      // Support arrays for tags if present
      if (Array.isArray(val)) {
        params.set(key, val.join(','));
      } else {
        params.set(key, String(val));
      }
    }
  }
  const qs = params.toString();
  return '/api/products/export' + (qs ? `?${qs}` : '');
}

const ExportCsvLink = ({ children = 'Export CSV', style, className, ...rest }) => {
  const router = useRouter();

  const href = useMemo(() => buildExportHref(router?.query || {}), [router?.query]);

  return (
    <a
      href={href}
      download
      className={className}
      style={style}
      data-testid="export-csv-link"
      {...rest}
    >
      {children}
    </a>
  );
};

export default ExportCsvLink;
