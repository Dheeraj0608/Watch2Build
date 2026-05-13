'use client'

import { motion } from 'framer-motion'

export default function ScaleOnHover({
  children,
  scale = 1.02,
  style,
}: {
  children: React.ReactNode
  scale?: number
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      style={{ ...style, cursor: 'pointer' }}
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
