'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function LoadingOverlay() {
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setLoading(false), 300)
          return 100
        }
        return prev + Math.floor(Math.random() * 8) + 3
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg-base)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{
              fontSize: '32px',
            }}
          >
            🧠
          </motion.div>

          <motion.p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              letterSpacing: '0.06em',
            }}
          >
            Loading {Math.min(count, 100)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
