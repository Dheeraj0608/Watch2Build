'use client'

import { useState } from 'react'

interface ErrorScreenProps {
  error: string
  onReset: () => void
  onManualSubmit: (transcript: string) => void
}

export default function ErrorScreen({ error, onReset, onManualSubmit }: ErrorScreenProps) {
  const [manualText, setManualText] = useState('')

  const isDisabled = manualText.trim().length === 0

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <i className="ti ti-alert-triangle" style={styles.icon} />
        <p style={styles.errorMessage}>{error}</p>
        
        <button onClick={onReset} style={styles.resetButton}>
          Try another URL
        </button>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>or paste transcript manually</span>
          <span style={styles.dividerLine} />
        </div>

        <textarea
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="Paste raw transcript text here..."
          style={styles.textarea}
        />

        <button
          onClick={() => onManualSubmit(manualText)}
          disabled={isDisabled}
          style={{
            ...styles.submitButton,
            opacity: isDisabled ? 0.5 : 1,
            cursor: isDisabled ? 'not-allowed' : 'pointer'
          }}
        >
          Analyze Manually →
        </button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg-primary)'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '520px',
    width: '100%',
    padding: '32px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-md)',
  },
  icon: {
    fontSize: '32px',
    color: 'var(--color-accent-warning)',
    marginBottom: '18px'
  },
  errorMessage: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    marginBottom: '24px'
  },
  resetButton: {
    padding: '12px 18px',
    fontSize: '14px',
    fontWeight: 700,
    border: '1px solid transparent',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--color-accent-info)',
    color: '#ffffff',
    marginBottom: '28px',
    boxShadow: '0 12px 24px rgba(92,107,240,0.18)'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: '12px',
    marginBottom: '24px'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'var(--color-border)'
  },
  dividerText: {
    fontSize: '14px',
    color: 'var(--color-text-tertiary)'
  },
  textarea: {
    width: '100%',
    minHeight: '180px',
    padding: '14px',
    fontSize: '14px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--color-bg-tertiary)',
    color: 'var(--color-text-primary)',
    marginBottom: '16px',
    resize: 'vertical'
  },
  submitButton: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    fontWeight: 700,
    backgroundColor: 'var(--color-accent-info)',
    color: '#ffffff',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    boxShadow: '0 14px 24px rgba(92,107,240,0.18)'
  }
}
