'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface BackgroundContextType {
  currentBackground: string
  setCurrentBackground: (background: string) => void
  getButtonColor: () => string
  getButtonTextColor: () => string
  getNavigationTextColor: () => string
  getSliderThumbColor: () => string
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [currentBackground, setCurrentBackground] = useState('orb')

  const getButtonColor = () => {
    switch (currentBackground) {
      case 'orb':
        return 'rgb(99, 102, 241)' // Blue-purple mix
      case 'galaxy':
        return 'rgb(17, 24, 39)' // Gray-900 like, less harsh than pure black
      case 'liquid':
        return 'rgb(229, 231, 235)' // Light gray
      case 'threads':
        return 'rgb(59, 130, 246)' // Blue (original)
      case 'prism':
        return 'rgb(20, 184, 166)' // Turquoise
      case 'darkveil':
        return 'rgb(147, 51, 234)' // Purple
      default:
        return 'rgb(59, 130, 246)' // Default blue
    }
  }

  const getButtonTextColor = () => {
    switch (currentBackground) {
      case 'liquid':
        return 'rgb(17, 24, 39)' // Dark text for liquid chrome
      default:
        return 'rgb(255, 255, 255)' // White text for all other backgrounds
    }
  }

  const getNavigationTextColor = () => {
    switch (currentBackground) {
      case 'galaxy':
        return 'rgb(245, 245, 245)' // Off-white text for galaxy background
      default:
        return 'rgb(17, 24, 39)' // Dark text for all other backgrounds
    }
  }

  const getSliderThumbColor = () => {
    return getButtonColor()
  }

  return (
    <BackgroundContext.Provider value={{
      currentBackground,
      setCurrentBackground,
      getButtonColor,
      getButtonTextColor,
      getNavigationTextColor,
      getSliderThumbColor
    }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export function useBackground() {
  const context = useContext(BackgroundContext)
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider')
  }
  return context
}
