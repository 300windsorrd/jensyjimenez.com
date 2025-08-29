'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, MapPin } from 'lucide-react'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'About', href: '#about' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">LR</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-neutral-900">
                  La Reina Del Sabor
                </h1>
                <p className="text-sm text-neutral-600">Dominican Cuisine</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-neutral-700 hover:text-primary-500 font-medium transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <a
                href="tel:+12018805153"
                className="flex items-center space-x-2 text-neutral-700 hover:text-primary-500 transition-colors duration-200"
              >
                <Phone className="w-4 h-4" />
                <span className="font-medium">(201) 880-5153</span>
              </a>
              <a
                href="https://www.grubhub.com/restaurant/la-reina-del-sabor-137-12-main-st-hackensack/348499"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                Order Now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-neutral-700 hover:text-primary-500 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-20 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/20" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 w-80 h-full bg-white shadow-2xl"
            >
              <div className="p-6">
                <nav className="space-y-4">
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className="block w-full text-left text-lg font-medium text-neutral-700 hover:text-primary-500 transition-colors duration-200 py-2"
                    >
                      {item.name}
                    </button>
                  ))}
                </nav>
                
                <div className="mt-8 space-y-4">
                  <a
                    href="tel:+12018805153"
                    className="flex items-center space-x-3 text-neutral-700 hover:text-primary-500 transition-colors duration-200"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-medium">(201) 880-5153</span>
                  </a>
                  <a
                    href="https://www.google.com/maps/place/137%201/2%20Main%20St,%20Hackensack,%20NJ%2007601"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-neutral-700 hover:text-primary-500 transition-colors duration-200"
                  >
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">137 1/2 Main St, Hackensack, NJ</span>
                  </a>
                  <a
                    href="https://www.grubhub.com/restaurant/la-reina-del-sabor-137-12-main-st-hackensack/348499"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn w-full justify-center"
                  >
                    Order Now
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header 