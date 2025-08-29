'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ShoppingCart, Clock, Truck, Star } from 'lucide-react'

const OrderNowBanner = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const benefits = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Fast Service",
      description: "Quick preparation and delivery"
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Free Delivery",
      description: "On orders over $15"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Fresh Food",
      description: "Made to order daily"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-dots-pattern-white"></div>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Online Ordering Available</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
          >
            Order Your Favorite{' '}
            <span className="text-secondary-300">Dominican Dishes</span> Today!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl text-primary-100 max-w-3xl mx-auto mb-8"
          >
            Skip the wait and order online for quick delivery or convenient pickup. 
            Our authentic Dominican cuisine is just a few clicks away from your table.
          </motion.p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid sm:grid-cols-3 gap-8 mb-12"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-primary-100">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <a
            href="https://www.grubhub.com/restaurant/la-reina-del-sabor-137-12-main-st-hackensack/348499"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-50 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Order on Grubhub
          </a>
          <a
            href="https://www.seamless.com/menu/la-reina-del-sabor-137-12-main-st-hackensack/348499"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-secondary-600 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Order on Seamless
          </a>
          <a
            href="tel:+12018805153"
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200 hover:scale-105"
          >
            Call to Order
          </a>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center space-x-6 text-primary-100 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Delivery: 8:00 AM - 8:00 PM</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4" />
              <span>Takeout: 7:30 AM - 8:00 PM</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default OrderNowBanner 