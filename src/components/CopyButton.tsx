import React, { useRef, useState, KeyboardEvent } from 'react';

type Props = {
  textToCopy: string;
  ariaLabel?: string;
  successMessage?: string;
  failureMessage?: string;
  className?: string;
};

const visuallyHidden: React.CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px',
};

export default function CopyButton({
  textToCopy,
  ariaLabel = 'Copy',
  successMessage = 'Copied',
  failureMessage = 'Copy failed',
  className,
}: Props) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const liveRef = useRef<HTMLDivElement | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  async function writeToClipboard(text: string): Promise<boolean> {
    // Primary: modern clipboard API
    if (navigator && (navigator as any).clipboard && typeof (navigator as any).clipboard.writeText === 'function') {
      try {
        await (navigator as any).clipboard.writeText(text);
        return true;
      } catch (e) {
        // fall through to fallback
      }
    }

    // Fallback: legacy execCommand('copy') approach
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      // avoid scrolling to bottom
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.setAttribute('aria-hidden', 'true');
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return !!successful;
    } catch (e) {
      return false;
    }
  }

  async function handleCopy() {
    const success = await writeToClipboard(textToCopy);
    const msg = success ? successMessage : failureMessage;

    // Update an ARIA live region so screen readers announce the result.
    if (liveRef.current) {
      // write text content. Using setTimeout to ensure some SRs notice updates triggered by clicks.
      liveRef.current.textContent = '';
      // small delay helps some AT announce repeated messages reliably.
      setTimeout(() => {
        if (liveRef.current) liveRef.current.textContent = msg;
      }, 50);
    }

    // Visible toast for sighted users
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);

    // Ensure keyboard focus remains predictable (focus back to the button).
    if (buttonRef.current) {
      try {
        buttonRef.current.focus();
      } catch (e) {
        // ignore focus failures
      }
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    // Activate on Space or Enter for consistent keyboard behavior
    if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
      e.preventDefault();
      handleCopy();
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        ref={buttonRef}
        onClick={() => void handleCopy()}
        onKeyDown={onKeyDown}
        aria-label={ariaLabel}
      >
        {ariaLabel}
      </button>

      {/* Visually-hidden ARIA live region for screen readers. role=status + aria-live=polite */}
      <div
        ref={liveRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={visuallyHidden}
        data-testid="copy-live-region"
      />

      {/* Visible lightweight toast fallback so sighted users get immediate feedback */}
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          data-testid="copy-toast"
          style={{
            position: 'relative',
            marginTop: 8,
            padding: '6px 10px',
            background: '#222',
            color: '#fff',
            borderRadius: 4,
            display: 'inline-block',
          }}
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
