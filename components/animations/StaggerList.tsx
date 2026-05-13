'use client'

'use client'

import { motion, useInView } from 'framer-motion'
import { Children, useRef, type ReactNode } from 'react'

interface StaggerListProps {
  children: ReactNode
  staggerDelay?: number
}

export default function StaggerList({
  children,
  staggerDelay = 0.08,
}: StaggerListProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: '-60px 0px',
  })

  const items = Children.toArray(children)

  return (
    <div ref={ref}>
      {items.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{
            duration: 0.5,
            delay: i * staggerDelay,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}
