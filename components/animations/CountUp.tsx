'use client'

import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useRef, useEffect } from 'react'

export default function CountUp({
  value,
  suffix = '',
  duration = 1.5,
}: {
  value: number
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const isInView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => `${Math.round(v)}${suffix}`)

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration })
      return controls.stop
    }
  }, [isInView, value, duration, count])

  return <motion.span ref={ref}>{rounded}</motion.span>
}
