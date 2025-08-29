 'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import LogoSwap from './LogoSwap'
import { usePathname } from 'next/navigation'
import PillNav from './PillNav/PillNavNext'
import { useBackground } from '@/contexts/BackgroundContext'
import './Navigation.css'
import { LayoutGroup } from 'framer-motion'
// Removed ThemeToggle from navigation to avoid duplicate toggles
// Theme-specific logos are managed in LogoSwap

interface NavigationProps {
  className?: string
}

const Navigation = ({ className = '' }: NavigationProps) => {
  const { getButtonColor, getButtonTextColor, getNavigationTextColor } = useBackground()
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)

  // Navigation should always be sticky for better accessibility and UX
  const isSticky = true

  // Navigation items
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/start', label: 'Get Started' }
  ]

  // Always add body padding for fixed navigation to prevent content overlap
  useEffect(() => {
    if (typeof document === 'undefined') return
    const body = document.body
    body.classList.add('has-fixed-nav')
    return () => {
      body.classList.remove('has-fixed-nav')
    }
  }, [])

  // Initialize theme from document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      const datasetTheme = root.dataset.theme
      setIsDark(datasetTheme ? datasetTheme === 'dark' : root.classList.contains('dark'))
    }
  }, [])

  // Follow system preference when no stored choice exists
  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('theme')
      if (!stored) {
        const root = document.documentElement
        const next = e.matches ? 'dark' : 'light'
        root.dataset.theme = next
        root.style.colorScheme = next === 'dark' ? 'dark' : 'light'
        if (next === 'dark') root.classList.add('dark')
        else root.classList.remove('dark')
        setIsDark(next === 'dark')
      }
    }
    media.addEventListener?.('change', handler)
    return () => media.removeEventListener?.('change', handler)
  }, [])

  // Also observe external theme changes to update the logo immediately
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    const sync = () => setIsDark(root.dataset.theme ? root.dataset.theme === 'dark' : root.classList.contains('dark'))
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme', 'class'] })
    return () => observer.disconnect()
  }, [])

  return (
    <LayoutGroup id="nav-customize">
      <PillNav
        logo={(<LogoSwap />) as unknown as string}
        logoHref="/about"
        items={navItems.map(item => ({
          href: item.href,
          label: item.label
        }))}
        activeHref={pathname}
        baseColor={isDark ? '#000000' : '#ffffff'}
        pillColor={getButtonColor()}
        pillTextColor={getNavigationTextColor()}
        hoveredPillTextColor="#1f2937"
        className={className}
        onMobileMenuClick={() => {}}
        slotItem={null}
        slotIndex={undefined}
        leftSlot={null}
        rightSlot={null}
        sticky={isSticky}
        topOffset={14}
      />
    </LayoutGroup>
  )
}

export default Navigation 
