'use client'

import { motion } from 'framer-motion'
import { ChevronDown, Star, Clock, MapPin } from 'lucide-react'

const Hero = () => {
  const scrollToMenu = () => {
    const menuSection = document.querySelector('#menu')
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-dots-pattern"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Star className="w-4 h-4 fill-current" />
              <span>Authentic Dominican Cuisine</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight"
            >
              Taste the{' '}
              <span className="text-gradient">Flavor</span> of{' '}
              <span className="text-gradient">Dominican</span> Home Cooking
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-lg sm:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Experience the rich flavors and warm hospitality of traditional Dominican cuisine. 
              From savory mangu to crispy pernil, every dish tells a story of family tradition.
            </motion.p>

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8 mb-8"
            >
              <div className="flex items-center space-x-2 text-neutral-600">
                <Clock className="w-5 h-5 text-primary-500" />
                <span className="font-medium">Open Daily 7:30 AM - 8:00 PM</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-600">
                <MapPin className="w-5 h-5 text-primary-500" />
                <span className="font-medium">Hackensack, NJ</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <a
                href="https://www.grubhub.com/restaurant/la-reina-del-sabor-137-12-main-st-hackensack/348499"
                target="_blank"
                rel="noopener noreferrer"
                className="btn text-lg px-8 py-4"
              >
                Order Now
              </a>
              <button
                onClick={scrollToMenu}
                className="btn-secondary text-lg px-8 py-4"
              >
                View Menu
              </button>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl font-bold">🍽️</span>
                    </div>
                    <p className="text-lg font-medium">Authentic Dominican Flavors</p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg"
              >
                <div className="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🇩🇴</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg"
              >
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-xl">⭐</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <button
          onClick={scrollToMenu}
          className="flex flex-col items-center space-y-2 text-neutral-600 hover:text-primary-500 transition-colors duration-200"
        >
          <span className="text-sm font-medium">Explore Menu</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </button>
      </motion.div>
    </section>
  )
}

export default Hero 