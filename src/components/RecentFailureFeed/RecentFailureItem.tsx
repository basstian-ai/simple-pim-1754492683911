import React, {useRef, useState} from 'react';

export interface FailureItem {
  id: string;
  title?: string;
  errorText: string;
  payload?: any;
  timestamp?: string;
  channel?: string;
}

interface RecentFailureItemProps {
  item: FailureItem;
  // optional notification callback so consumers (app shell) can show toasts
  onNotify?: (msg: string) => void;
}

export const RecentFailureItem: React.FC<RecentFailureItemProps> = ({item, onNotify}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const safeNotify = (msg: string) => {
    try {
      onNotify && onNotify(msg);
    } catch (e) {
      // swallowing: notification should not break behavior
      // eslint-disable-next-line no-console
      console.warn('notification handler failed', e);
    }
  };

  const copyToClipboard = async (text: string) => {
    if (!text) {
      safeNotify('Nothing to copy');
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        // execCommand may be deprecated in some envs but we keep fallback
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      safeNotify('Copied to clipboard');
    } catch (err) {
      safeNotify('Copy failed');
    }
  };

  const handleCopyErrorText = async () => {
    await copyToClipboard(item.errorText);
    setOpen(false);
  };

  const handleCopyJobId = async () => {
    await copyToClipboard(item.id);
    setOpen(false);
  };

  const handleDownloadPayload = () => {
    if (item.payload === undefined || item.payload === null) {
      safeNotify('No payload available for this item');
      setOpen(false);
      return;
    }

    try {
      const data = typeof item.payload === 'string' ? item.payload : JSON.stringify(item.payload, null, 2);
      const blob = new Blob([data], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `failed-payload-${item.id}.json`;
      // ensure anchor is part of document so click works in some environments
      document.body.appendChild(a);
      a.click();
      a.remove();
      // revoke after a tick to be safe
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      safeNotify('Download started');
    } catch (err) {
      safeNotify('Download failed');
    } finally {
      setOpen(false);
    }
  };

  // simple accessible menu (no external deps)
  return (
    <div className="recent-failure-item" style={{display: 'flex', alignItems: 'center', gap: 12}}>
      <div style={{flex: 1}}>
        <div style={{fontWeight: 600}}>{item.title ?? `Job ${item.id}`}</div>
        <div style={{color: '#666', fontSize: 13}}>{item.errorText}</div>
      </div>

      <div style={{position: 'relative'}} ref={menuRef}>
        <button
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={`Actions for failure ${item.id}`}
          onClick={() => setOpen(o => !o)}
          style={{padding: '6px 8px', borderRadius: 6}}
          data-testid="overflow-button"
        >
          ⋯
        </button>

        {open && (
          <div
            role="menu"
            aria-label="failure-actions"
            style={{
              position: 'absolute',
              right: 0,
              marginTop: 6,
              minWidth: 220,
              background: 'white',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
              borderRadius: 6,
              zIndex: 1000,
              padding: 6,
            }}
            data-testid="overflow-menu"
          >
            <button
              role="menuitem"
              onClick={handleCopyErrorText}
              style={{display: 'block', width: '100%', padding: '8px 10px', textAlign: 'left', border: 'none', background: 'transparent'}}
              data-testid="action-copy-error"
            >
              Copy error text
            </button>

            <button
              role="menuitem"
              onClick={handleCopyJobId}
              style={{display: 'block', width: '100%', padding: '8px 10px', textAlign: 'left', border: 'none', background: 'transparent'}}
              data-testid="action-copy-jobid"
            >
              Copy job ID
            </button>

            <button
              role="menuitem"
              onClick={handleDownloadPayload}
              style={{display: 'block', width: '100%', padding: '8px 10px', textAlign: 'left', border: 'none', background: 'transparent'}}
              data-testid="action-download-payload"
            >
              Download failed payload
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentFailureItem;
