'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import './StylePicker.css'

type NavStyle = 'traditional' | 'pill'

export interface StylePickerProps {
  currentStyle: NavStyle
  onPick: (style: NavStyle) => void
  buttonKind: NavStyle
  colors: { bg: string; fg: string }
  inline?: boolean
  initialMinimized?: boolean
}

const COLLAPSE_DELAY_MS = 300

export default function StylePicker({
  currentStyle,
  onPick,
  buttonKind,
  colors,
  inline = true,
  initialMinimized = true,
}: StylePickerProps) {
  const [minimized, setMinimized] = useState<boolean>(initialMinimized)
  const collapseTimerRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (collapseTimerRef.current) window.clearTimeout(collapseTimerRef.current)
  }, [])

  const containerClassName = useMemo(() => {
    const base = ['stylepicker', inline ? 'inline' : '']
    base.push(buttonKind)
    base.push(minimized ? 'minimized' : 'expanded')
    return base.filter(Boolean).join(' ')
  }, [buttonKind, inline, minimized])

  const handlePick = (style: NavStyle) => {
    onPick(style)
    if (collapseTimerRef.current) window.clearTimeout(collapseTimerRef.current)
    collapseTimerRef.current = window.setTimeout(() => {
      setMinimized(true)
    }, COLLAPSE_DELAY_MS) as unknown as number
  }

  const sharedBtnProps = {
    style: { backgroundColor: colors.bg, color: colors.fg },
  }

  return (
    <LayoutGroup id="stylepicker">
      <div className={containerClassName}>
        <AnimatePresence initial={false} mode="wait">
          {minimized ? (
            <motion.button
              key="sp-min"
              layoutId="sp-toggle"
              className={buttonKind === 'pill' ? 'sp-pill-btn' : 'sp-trad-btn'}
              aria-label="Customize navigation style"
              onClick={() => setMinimized(false)}
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              {...sharedBtnProps}
            >
              Customize
            </motion.button>
          ) : (
            <motion.div
              key="sp-exp"
              layoutId="sp-toggle"
              className="sp-options"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                className={`${buttonKind === 'pill' ? 'sp-pill-btn' : 'sp-trad-btn'} ${currentStyle === 'traditional' ? 'active' : ''}`}
                aria-label="Switch to traditional navigation"
                onClick={() => handlePick('traditional')}
                {...sharedBtnProps}
              >
                Trad
              </motion.button>
              <motion.button
                className={`${buttonKind === 'pill' ? 'sp-pill-btn' : 'sp-trad-btn'} ${currentStyle === 'pill' ? 'active' : ''}`}
                aria-label="Switch to pill navigation"
                onClick={() => handlePick('pill')}
                {...sharedBtnProps}
              >
                Pill
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  )
}


