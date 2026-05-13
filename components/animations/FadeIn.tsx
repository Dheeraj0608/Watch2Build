'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function FadeIn({
  children,
  delay = 0,
  style,
  className,
}: {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: '-60px 0px',
  })

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
