'use client'

import { motion } from 'framer-motion'

interface MarqueeProps {
  text: string
  speed?: number
  separator?: string
}

export default function Marquee({
  text,
  speed = 30,
  separator = '·',
}: MarqueeProps) {
  const repeated = Array(8).fill(text).join(` ${separator} `)

  return (
    <div
      style={{
        overflow: 'hidden',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 0',
        background: 'var(--bg-elevated)',
        margin: '32px 0',
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--text-tertiary)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {repeated} {repeated}
      </motion.div>
    </div>
  )
}
