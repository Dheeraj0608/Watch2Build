'use client'

import { motion } from 'framer-motion'

interface LoadingScreenProps {
  message: string
}

export default function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <motion.span
          animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={styles.brainEmoji}
        >
          🧠
        </motion.span>

        <div style={styles.dots}>
          <div style={{ ...styles.dot, animationDelay: '0ms' }} />
          <div style={{ ...styles.dot, animationDelay: '150ms' }} />
          <div style={{ ...styles.dot, animationDelay: '300ms' }} />
        </div>

        <p style={styles.message}>{message}</p>
        <p style={styles.submessage}>This takes 15-30 seconds for long tutorials</p>

        <div style={styles.progressTrack}>
          <motion.div
            style={styles.progressFill}
            initial={{ width: '0%' }}
            animate={{ width: '85%' }}
            transition={{ duration: 28, ease: 'easeInOut' }}
          />
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}} />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg-primary)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-xl)',
    padding: '32px',
    boxShadow: 'var(--shadow-md)',
    maxWidth: '520px',
    width: '100%',
  },
  brainEmoji: {
    display: 'inline-block',
    fontSize: '48px',
    marginBottom: '18px',
  },
  dots: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px'
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-accent-info)',
    animation: 'pulse 1.5s infinite ease-in-out'
  },
  progressTrack: {
    width: '100%',
    height: '8px',
    backgroundColor: 'var(--color-bg-tertiary)',
    borderRadius: '999px',
    overflow: 'hidden',
    marginTop: '24px',
  },
  progressFill: {
    height: '100%',
    borderRadius: '999px',
    background: 'linear-gradient(90deg, var(--brand-purple), var(--brand-teal))',
  },
  message: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    marginBottom: '8px'
  },
  submessage: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)'
  }
}
