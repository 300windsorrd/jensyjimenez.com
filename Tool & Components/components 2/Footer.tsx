'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { MapPin, Phone, Clock, Mail, Facebook, Instagram, Twitter } from 'lucide-react'

const Footer = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const footerLinks = {
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Our Story', href: '#about' },
      { name: 'Contact', href: '#contact' },
      { name: 'Careers', href: '#' }
    ],
    menu: [
      { name: 'Breakfast', href: '#menu' },
      { name: 'Main Dishes', href: '#menu' },
      { name: 'Family Meals', href: '#menu' },
      { name: 'Daily Specials', href: '#menu' }
    ],
    services: [
      { name: 'Delivery', href: '#contact' },
      { name: 'Takeout', href: '#contact' },
      { name: 'Catering', href: '#contact' },
      { name: 'Online Ordering', href: 'https://www.grubhub.com/restaurant/la-reina-del-sabor-137-12-main-st-hackensack/348499' }
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Order Status', href: '#' },
      { name: 'Returns', href: '#' },
      { name: 'Contact Support', href: 'tel:+12018805153' }
    ]
  }

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, href: '#' },
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, href: '#' },
    { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, href: '#' }
  ]

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          {/* Company Info */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">LR</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">La Reina Del Sabor</h3>
                <p className="text-neutral-400 text-sm">Dominican Cuisine</p>
              </div>
            </div>
            <p className="text-neutral-300 mb-6 leading-relaxed">
              Bringing authentic Dominican flavors and warm hospitality to Hackensack since day one. 
              Every dish tells a story of tradition, love, and rich culinary heritage.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-neutral-300">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span className="text-sm">137 1/2 Main St, Hackensack, NJ 07601</span>
              </div>
              <div className="flex items-center space-x-3 text-neutral-300">
                <Phone className="w-4 h-4 text-primary-400" />
                <a href="tel:+12018805153" className="text-sm hover:text-white transition-colors duration-200">
                  (201) 880-5153
                </a>
              </div>
              <div className="flex items-center space-x-3 text-neutral-300">
                <Clock className="w-4 h-4 text-primary-400" />
                <span className="text-sm">Daily: 7:30 AM - 8:00 PM</span>
              </div>
            </div>
          </motion.div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 * (index + 1) }}
              className="lg:col-span-1"
            >
              <h4 className="text-lg font-semibold mb-4 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <ul className="space-y-2">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="border-t border-neutral-800 pt-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="text-neutral-400 text-sm">
              <p>&copy; 2024 La Reina Del Sabor. All rights reserved.</p>
              <p className="mt-1">Serving authentic Dominican cuisine in Hackensack, NJ</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-neutral-400 text-sm">Follow us:</span>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-300 hover:bg-primary-500 hover:text-white transition-all duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Additional Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-8 pt-8 border-t border-neutral-800"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-wrap items-center justify-center lg:justify-start space-x-6 text-neutral-400 text-sm">
                <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors duration-200">Cookie Policy</a>
                <a href="#" className="hover:text-white transition-colors duration-200">Accessibility</a>
              </div>
              
              <div className="text-center lg:text-right">
                <p className="text-neutral-500 text-xs mb-2">
                  Powered by authentic Dominican recipes and family tradition
                </p>
                <p className="text-neutral-600 text-xs">
                  Made with ❤️ in Hackensack, New Jersey
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-all duration-200 hover:scale-110 z-40"
        aria-label="Back to top"
      >
        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </footer>
  )
}

export default Footer 