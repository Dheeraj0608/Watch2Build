'use client'

import { useEffect } from 'react'
import type Lenis from 'lenis'

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    let lenis: Lenis | undefined

    const initLenis = async () => {
      const LenisCtor = (await import('lenis')).default
      const instance = new LenisCtor({
        duration: 1.2,
        easing: (t: number) =>
          Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })
      lenis = instance

      function raf(time: number) {
        instance.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    }

    initLenis()
    return () => lenis?.destroy()
  }, [])

  return <>{children}</>
}
