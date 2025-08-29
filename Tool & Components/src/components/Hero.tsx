'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import BackgroundSlider from './BackgroundSlider'
import { useBackground } from '@/contexts/BackgroundContext'
import TextType from '@/TextAnimations/TextType/TextType.jsx'
import TextCleaningStyles from './TextCleaningStyles'
import { cleanText, validateCleanText } from '@/lib/textUtils'
import { useTextMonitor } from '@/hooks/useTextMonitor'

// Lazy-load heavy animated backgrounds to reduce initial JS and improve LCP
const Orb = dynamic(() => import('@/Backgrounds/Orb/Orb.jsx'), { ssr: false })
const Galaxy = dynamic(() => import('@/Backgrounds/Galaxy/Galaxy.jsx'), { ssr: false })
const LiquidChrome = dynamic(() => import('@/Backgrounds/LiquidChrome/LiquidChrome.jsx'), { ssr: false })
const Threads = dynamic(() => import('@/Backgrounds/Threads/Threads.jsx'), { ssr: false })
const Prism = dynamic(() => import('@/Backgrounds/Prism/Prism.jsx'), { ssr: false })
const DarkVeil = dynamic(() => import('@/Backgrounds/DarkVeil/DarkVeil.jsx'), { ssr: false })

export default function Hero() {
  const { setCurrentBackground, getButtonColor, getButtonTextColor } = useBackground()
  const textRef = useRef<HTMLSpanElement>(null)
  
  type BackgroundTextColors = {
    primary: string
    secondary: string
    accent: string
    slider?: string
  }

  type BackgroundItem = {
    key: string
    label: string
    word: string
    Component: any
    props: Record<string, any>
    textColors: BackgroundTextColors
  }

  const backgrounds: ReadonlyArray<BackgroundItem> = [
    { 
      key: 'orb', 
      label: 'Orb', 
      word: 'Fantastic', 
      Component: Orb, 
      props: {},
      textColors: {
        primary: 'text-gray-900',
        secondary: 'text-gray-700',
        accent: 'text-blue-600'
      }
    },
    { 
      key: 'galaxy', 
      label: 'Galaxy', 
      word: 'Revolutionary',
      Component: Galaxy, 
      props: {
        mouseInteraction: true,
        mouseRepulsion: true,
        density: 1.3,
        glowIntensity: 0.3,
        saturation: 0.0,
        hueShift: 140,
        twinkleIntensity: 0.3,
        rotationSpeed: 0.1,
        repulsionStrength: 1,
        autoCenterRepulsion: 0,
        starSpeed: 0.5,
        speed: 1.0,
        transparent: false,
      },
      textColors: {
        primary: 'text-white',
        secondary: 'text-gray-300',
        accent: 'text-gray-300'
      }
    },
    { 
      key: 'liquid', 
      label: 'Liquid Chrome', 
      word: 'Game-Changing', 
      Component: LiquidChrome, 
      props: {},
      textColors: {
        primary: 'text-black',
        secondary: 'text-gray-800',
        accent: 'text-blue-600'
      }
    },
    {
      key: 'threads',
      label: 'Threads',
      word: 'Customizable',
      Component: Threads,
      props: { 
        color: [0.2, 0.45, 1], 
        amplitude: 2, 
        distance: 0.5,
        className: 'w-full h-[220vh] -translate-y-[40vh] md:h-full md:translate-y-0'
      },
      textColors: {
        primary: 'text-gray-900',
        secondary: 'text-gray-700',
        accent: 'text-blue-600'
      }
    },
    {
      key: 'prism',
      label: 'Prism',
      word: 'Prismatic',
      Component: Prism,
      props: {
        animationType: 'rotate',
        timeScale: 0.4,
        scale: 3.9,
        height: 3.5,
        baseWidth: 5.5,
        noise: 0,
        glow: 1,
        hueShift: 0,
        colorFrequency: 1,
      },
      textColors: {
        primary: 'text-black',
        secondary: 'text-gray-800',
        accent: 'text-cyan-700',
        slider: 'text-gray-800'
      }
    },
    {
      key: 'darkveil',
      label: 'Dark Veil',
      word: 'Elegant',
      Component: DarkVeil,
      props: {
        hueShift: 0,
        noiseIntensity: 0.1,
        scanlineIntensity: 0.08,
        speed: 0.6,
        scanlineFrequency: 0.0,
        warpAmount: 0.02,
      },
      textColors: {
        primary: 'text-white',
        secondary: 'text-gray-200',
        accent: 'text-indigo-300',
        slider: 'text-gray-300'
      }
    },
  ]
  const [bgIndex, setBgIndex] = useState(0)
  const SelectedBg = backgrounds[bgIndex].Component
  const isWhitePricing = ['galaxy', 'liquid', 'prism', 'darkveil'].includes(backgrounds[bgIndex].key)

  // Use the text monitoring hook to prevent periods
  useTextMonitor([bgIndex], textRef)
  
  // Validate background words for periods
  useEffect(() => {
    const currentWord = backgrounds[bgIndex]?.word
    if (currentWord) {
      validateCleanText(currentWord, 'background word')
    }
  }, [bgIndex])

  // Update background context when bgIndex changes
  useEffect(() => {
    setCurrentBackground(backgrounds[bgIndex].key)
  }, [bgIndex, setCurrentBackground])

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <TextCleaningStyles />
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        {/* Defer mounting animated background until idle to improve LCP */}
        <IdleBackground component={SelectedBg} props={backgrounds[bgIndex].props as any} />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={false} className="mb-8">
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${backgrounds[bgIndex].textColors.primary} mb-6 leading-tight`}>
              Transform Your Business with
              <span className={`${backgrounds[bgIndex].textColors.accent} block`} ref={textRef}>
                <TextType
                  key={backgrounds[bgIndex].key}
                  as="span"
                  className="underline font-extrabold"
                  text={cleanText(backgrounds[bgIndex].word)}
                  typingSpeed={60}
                  deletingSpeed={30}
                  pauseDuration={1000}
                  loop={false}
                  showCursor={true}
                  cursorBlinkDuration={0.5}
                  textColors={["currentColor"]}
                  onSentenceComplete={(text) => validateCleanText(text, 'TextType output')}
                />
                Web Design
              </span>
            </h1>
            <p className={`text-xl lg:text-2xl ${backgrounds[bgIndex].textColors.secondary} max-w-3xl mx-auto leading-relaxed`}>
              Get a custom website that converts visitors into customers. Modern, responsive designs 
              that perfectly represent your brand and drive real business results.
            </p>
          </motion.div>

          <motion.div initial={false} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="#start-project"
              className="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              style={({ 
                backgroundColor: getButtonColor(),
                color: getButtonTextColor(),
                ['--tw-shadow-color' as any]: getButtonColor(),
                ['--tw-shadow' as any]: `0 10px 15px -3px ${getButtonColor()}40, 0 4px 6px -4px ${getButtonColor()}40`
              } as React.CSSProperties)}
            >
              Start Your Project
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="#pricing"
              className={`inline-flex items-center justify-center px-8 py-4 font-semibold rounded-lg transition-all duration-200 ${
                isWhitePricing
                  ? 'bg-white text-black border border-gray-200 hover:bg-white/90 shadow-sm'
                  : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              View Pricing
            </a>
          </motion.div>

          {/* Background Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-12"
          >
            <BackgroundSlider
              value={bgIndex}
              onChange={setBgIndex}
              max={backgrounds.length - 1}
              labels={backgrounds.map(b => b.label)}
              textColors={backgrounds[bgIndex].textColors}
            />
          </motion.div>

          
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" aria-hidden="true">
        <div className={`absolute top-20 left-10 w-72 h-72 ${backgrounds[bgIndex].textColors.accent}/10 rounded-full blur-3xl`}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 ${backgrounds[bgIndex].textColors.accent}/10 rounded-full blur-3xl`}></div>
      </div>
    </section>
  )
}

// Small helper to mount heavy animated backgrounds after idle time
function IdleBackground({ component: Component, props }: { component: any; props: any }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(() => setReady(true), { timeout: 1200 })
    } else {
      const t = setTimeout(() => setReady(true), 600)
      return () => clearTimeout(t)
    }
  }, [])
  if (!ready) return null
  return <Component {...props} />
}
