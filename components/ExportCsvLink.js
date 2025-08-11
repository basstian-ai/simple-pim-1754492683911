import React, { useState } from 'react';
import { useRouter } from 'next/router';

// Builds an export URL for products that mirrors the filtering used in the UI.
function buildExportUrl(query = {}) {
  const params = [];
  if (query.search) params.push(`search=${encodeURIComponent(query.search)}`);
  // Accept either a joined string or array; keep behavior consistent with client-side usage
  if (query.tags) {
    // If tags is an array, join by comma; otherwise assume it's already stringified
    const tagsValue = Array.isArray(query.tags) ? query.tags.join(',') : query.tags;
    if (tagsValue) params.push(`tags=${encodeURIComponent(tagsValue)}`);
  }
  if (query.inStock === '1' || query.inStock === 'true') params.push('inStock=1');
  const qs = params.length ? `?${params.join('&')}` : '';
  return `/api/products/export${qs}`;
}

export default function ExportCsvLink({ style }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const query = (router && router.query) || {};
  const urlPath = buildExportUrl(query);

  const copyToClipboard = async () => {
    try {
      const absolute = (typeof window !== 'undefined' && window.location && window.location.origin)
        ? `${window.location.origin}${urlPath}`
        : urlPath;

      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(absolute);
      } else if (typeof document !== 'undefined') {
        // Fallback copy approach
        const ta = document.createElement('textarea');
        ta.value = absolute;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      // Swallow errors: copying is a convenience feature
      // Optionally: report to analytics or show UI error in future
    }
  };

  return (
    <span style={style}>
      <a href={urlPath} download style={{ marginRight: 8 }}>
        Export CSV
      </a>
      <button onClick={copyToClipboard} aria-label="Copy export URL">
        {copied ? 'Copied!' : 'Copy URL'}
      </button>
    </span>
  );
}
