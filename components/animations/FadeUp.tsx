'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface FadeUpProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}

export default function FadeUp({
  children,
  delay = 0,
  duration = 0.6,
  className,
  style,
}: FadeUpProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: '-80px 0px',
  })

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {children}
    </motion.div>
  )
}
