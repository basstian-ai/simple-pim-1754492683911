import React from 'react';
import { encodeFiltersToParam, FailureFeedFilters } from '../utils/filterUrl';

export type CopyLinkButtonProps = {
  filters: FailureFeedFilters;
  // optional label
  label?: string;
  // optional callback for success/failure
  onResult?: (ok: boolean, text?: string) => void;
};

// CopyLinkButton: creates a short shareable URL for the current filters and copies it to clipboard.
// - Fallbacks to a temporary input if navigator.clipboard is not available.
export const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({ filters, label = 'Copy link', onResult }) => {
  const handleClick = async () => {
    try {
      const param = encodeFiltersToParam(filters);
      const url = `${window.location.origin}${window.location.pathname}?f=${encodeURIComponent(param)}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        onResult && onResult(true, url);
        return;
      }

      // Fallback approach
      const input = document.createElement('input');
      input.setAttribute('value', url);
      document.body.appendChild(input);
      input.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(input);
      onResult && onResult(Boolean(ok), url);
    } catch (err) {
      onResult && onResult(false, String(err));
    }
  };

  return (
    <button type="button" onClick={handleClick} aria-label="Copy link to current filters">
      {label}
    </button>
  );
};

export default CopyLinkButton;
