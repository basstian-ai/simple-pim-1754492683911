import React from 'react';

export type QueryTimeoutBannerProps = {
  visible: boolean;
  onRetry: () => void;
  onNarrow: () => void;
  onCancel?: () => void;
  message?: string;
  retryLabel?: string;
  narrowLabel?: string;
  cancelLabel?: string;
};

export const QueryTimeoutBanner: React.FC<QueryTimeoutBannerProps> = ({
  visible,
  onRetry,
  onNarrow,
  onCancel,
  message = 'This query is taking longer than expected.',
  retryLabel = 'Retry',
  narrowLabel = 'Narrow range',
  cancelLabel = 'Cancel',
}) => {
  if (!visible) return null;

  return (
    <div role="status" aria-live="polite" style={{
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      background: '#fff4e5',
      border: '1px solid #ffd7a8',
      padding: 12,
      borderRadius: 6,
    }}>
      <div style={{flex: 1}}>
        <strong style={{display: 'block', marginBottom: 6}}>Query timeout</strong>
        <div>{message} Try narrowing the query or retry.</div>
      </div>

      <div style={{display: 'flex', gap: 8}}>
        <button onClick={onRetry} aria-label="retry-query">{retryLabel}</button>
        <button onClick={onNarrow} aria-label="narrow-query">{narrowLabel}</button>
        {onCancel ? (
          <button onClick={onCancel} aria-label="cancel-query">{cancelLabel}</button>
        ) : null}
      </div>
    </div>
  );
};

export default QueryTimeoutBanner;
