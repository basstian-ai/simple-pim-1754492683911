import React from 'react'
import { redactPayload, DEFAULT_REDACTION_RULES, RedactOptions } from '../utils/redact'

type Props = {
  payload: string
  visible: boolean
  onClose: () => void
  title?: string
  // optional override to control redaction rules and preview size
  redactOptions?: RedactOptions
  // redact by default unless explicitly set to false
  redactByDefault?: boolean
}

export const FailedPayloadPreview: React.FC<Props> = ({
  payload,
  visible,
  onClose,
  title = 'Failed payload preview',
  redactOptions,
  redactByDefault = true
}) => {
  if (!visible) return null

  const opts = redactOptions ?? (redactByDefault ? { rules: DEFAULT_REDACTION_RULES } : undefined)
  const preview = redactPayload(payload ?? '', opts)

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(preview)
      } else {
        // fallback
        const ta = document.createElement('textarea')
        ta.value = preview
        ta.setAttribute('readonly', '')
        ta.style.position = 'absolute'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      // we intentionally do not show UI here; caller may instrument events
    } catch (e) {
      // swallow - component is UI-only; instrumentation/logging outside
      console.error('copy failed', e)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([preview], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'failed-payload.txt'
    // ensure anchor is in document for Safari
    document.body.appendChild(a)
    // trigger
    a.click()
    // cleanup
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 0)
  }

  return (
    <div role="dialog" aria-modal="true" aria-label={title} style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <strong>{title}</strong>
          <div>
            <button onClick={handleCopy} aria-label="copy-payload" style={buttonStyle}>
              Copy
            </button>
            <button onClick={handleDownload} aria-label="download-payload" style={buttonStyle}>
              Download
            </button>
            <button onClick={onClose} aria-label="close" style={closeButtonStyle}>
              Close
            </button>
          </div>
        </div>
        <div style={bodyStyle}>
          <pre style={preStyle} data-testid="payload-preview">
            {preview}
          </pre>
        </div>
      </div>
    </div>
  )
}

// Inline simple styles to keep file self-contained. In a real app use design tokens.
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
}
const modalStyle: React.CSSProperties = {
  width: 'min(900px, 95%)',
  maxHeight: '80vh',
  background: '#fff',
  borderRadius: 8,
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
}
const headerStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid #eee',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}
const bodyStyle: React.CSSProperties = {
  padding: 12,
  overflow: 'auto',
  background: '#fafafa'
}
const preStyle: React.CSSProperties = {
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace',
  fontSize: 12,
  margin: 0
}
const buttonStyle: React.CSSProperties = {
  marginLeft: 8,
  padding: '6px 10px',
  cursor: 'pointer'
}
const closeButtonStyle: React.CSSProperties = {
  marginLeft: 12,
  padding: '6px 10px',
  cursor: 'pointer',
  background: '#f3f4f6',
  borderRadius: 4
}

export default FailedPayloadPreview
