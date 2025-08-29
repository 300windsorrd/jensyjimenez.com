'use client'

import { motion } from 'framer-motion'
import { useMemo, useEffect, useState } from 'react'
import { useBackground } from '@/contexts/BackgroundContext'
import GradientText from '@/TextAnimations/GradientText/GradientText'
import '@/TextAnimations/GradientText/GradientText.css'
import { Fredoka } from 'next/font/google'
import ThemeToggle from './ThemeToggle'

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-fredoka',
  display: 'swap',
})

interface BackgroundSliderProps {
  value: number
  onChange: (value: number) => void
  max: number
  labels: string[]
  textColors: {
    primary: string
    secondary: string
    accent: string
    slider?: string
  }
}

export default function BackgroundSlider({ 
  value, 
  onChange, 
  max, 
  labels, 
  textColors 
}: BackgroundSliderProps) {
  const { getButtonColor, getButtonTextColor } = useBackground()

  const buttonColor = getButtonColor()
  const buttonTextColor = getButtonTextColor()
  const inactiveClass = 'text-gray-700'

  // Important: don't read from document during initial render to avoid SSR/CSR mismatch
  const [isDark, setIsDark] = useState<boolean>(false)

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    const update = () => setIsDark((root.dataset.theme === 'dark') || root.classList.contains('dark'))

    update()
    const observer = new MutationObserver(() => update())
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme', 'class'] })
    return () => observer.disconnect()
  }, [])

  const clampedValue = useMemo(() => {
    const upper = Math.max(0, Math.min(max, value))
    return upper
  }, [value, max])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 p-5" data-background-customization="true">
        {/* Theme toggle in top-right of the box */}
        <div className="absolute right-3 top-3">
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-center mb-4">
          <div className={`${fredoka.className} text-xl sm:text-2xl font-extrabold ${textColors.slider || textColors.secondary} text-center`}>
            <GradientText animationSpeed={6}>Customize Background</GradientText>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {labels.map((label, index) => {
            const isActive = index === clampedValue
            return (
              <motion.button
                key={index}
                type="button"
                onClick={() => onChange(index)}
                className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${isActive ? 'shadow-lg' : 'hover:shadow'} ${isActive ? '' : 'border-gray-300'}`}
                style={isActive ? (isDark 
                  ? { backgroundColor: '#000', color: '#fff', borderColor: '#000' } 
                  : { backgroundColor: buttonColor, color: buttonTextColor, borderColor: buttonColor }
                ) : {}}
                aria-pressed={isActive}
                data-background-customization="true"
                data-background={label.toLowerCase().replace(/\s+/g, '-')}
                whileHover={isActive ? { scale: 1.03 } : { scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className={isActive ? '' : `${inactiveClass}`}>{label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
