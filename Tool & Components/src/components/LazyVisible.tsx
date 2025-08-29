'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface LazyVisibleProps {
  children: ReactNode
  rootMargin?: string
  once?: boolean
}

export default function LazyVisible({ children, rootMargin = '200px 0px', once = true }: LazyVisibleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          setIsVisible(true)
          if (once) io.disconnect()
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { root: null, threshold: 0.01, rootMargin }
    )

    io.observe(node)
    return () => io.disconnect()
  }, [rootMargin, once])

  return <div ref={containerRef}>{isVisible ? children : null}</div>
}


