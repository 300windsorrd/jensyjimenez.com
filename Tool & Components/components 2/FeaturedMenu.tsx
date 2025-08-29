'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ChevronRight, Star, Clock } from 'lucide-react'

const FeaturedMenu = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const featuredDishes = [
    {
      id: 1,
      name: "Mangu",
      description: "Traditional Dominican mashed plantains with 3 Golpe (salami, cheese, and eggs)",
      price: "$7.00",
      category: "Breakfast",
      popular: true,
      image: "🍌"
    },
    {
      id: 2,
      name: "Mofongo Dominicano",
      description: "Crispy plantain mash with green salad and your choice of protein",
      price: "$9.99",
      category: "Main Course",
      popular: true,
      image: "🥘"
    },
    {
      id: 3,
      name: "Roast Pork (Pernil)",
      description: "Succulent roast pork with large rice, large beans, green salad, and 2 liter soda",
      price: "$25.99",
      category: "Family Meal",
      popular: true,
      image: "🥩"
    },
    {
      id: 4,
      name: "Picadera 5-7 People",
      description: "Feast platter with sausage, fried pork, fried chicken, arepa with cheese, sweet plantain. Free 2 liter soda",
      price: "$29.99",
      category: "Family Meal",
      popular: true,
      image: "🍽️"
    },
    {
      id: 5,
      name: "Perico Eggs",
      description: "Scrambled eggs with tomatoes, onions, and peppers - Dominican style",
      price: "$3.49",
      category: "Breakfast",
      popular: false,
      image: "🍳"
    },
    {
      id: 6,
      name: "La Bandera Dominicana",
      description: "The Dominican flag: white rice, red beans, and meat with avocado and fried plantains",
      price: "$12.99",
      category: "Traditional",
      popular: false,
      image: "🏳️"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="menu" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Star className="w-4 h-4 fill-current" />
            <span>Signature Dishes</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6"
          >
            Our Most Popular{' '}
            <span className="text-gradient">Dominican Dishes</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-neutral-600 max-w-3xl mx-auto"
          >
            Discover the authentic flavors that make La Reina Del Sabor the go-to destination 
            for Dominican cuisine in Hackensack. Each dish is prepared with love and tradition.
          </motion.p>
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredDishes.map((dish, index) => (
            <motion.div
              key={dish.id}
              variants={itemVariants}
              className="group relative"
            >
              <div className="card p-6 h-full hover:scale-105 transition-transform duration-300">
                {/* Popular Badge */}
                {dish.popular && (
                  <div className="absolute -top-3 -right-3 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                )}

                {/* Dish Image */}
                <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow duration-300">
                  <span className="text-6xl">{dish.image}</span>
                </div>

                {/* Dish Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-200">
                      {dish.name}
                    </h3>
                    <span className="text-lg font-bold text-primary-600">
                      {dish.price}
                    </span>
                  </div>

                  <p className="text-sm text-neutral-500 mb-3">
                    {dish.category}
                  </p>

                  <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                    {dish.description}
                  </p>

                  {/* Order Button */}
                  <a
                    href="https://www.grubhub.com/restaurant/la-reina-del-sabor-137-12-main-st-hackensack/348499"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium text-sm group-hover:translate-x-1 transition-all duration-200"
                  >
                    <span>Order Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View Full Menu CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              Hungry for More?
            </h3>
            <p className="text-neutral-600 mb-6">
              There's still more delicious dishes to discover on our full menu. 
              From traditional favorites to daily specials, we have something for everyone.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="https://www.grubhub.com/restaurant/la-reina-del-sabor-137-12-main-st-hackensack/348499"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                Order Full Menu
              </a>
              <a
                href="tel:+12018805153"
                className="btn-outline"
              >
                Call to Order
              </a>
            </div>
          </div>
        </motion.div>

        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-16 grid sm:grid-cols-3 gap-8 text-center"
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-primary-600" />
            </div>
            <h4 className="text-lg font-semibold text-neutral-900">Quick Service</h4>
            <p className="text-neutral-600 text-sm">Fast delivery and takeout available</p>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center">
              <Star className="w-8 h-8 text-secondary-600" />
            </div>
            <h4 className="text-lg font-semibold text-neutral-900">Authentic Taste</h4>
            <p className="text-neutral-600 text-sm">Traditional Dominican recipes</p>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🇩🇴</span>
            </div>
            <h4 className="text-lg font-semibold text-neutral-900">Family Owned</h4>
            <p className="text-neutral-600 text-sm">Serving Hackensack since day one</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedMenu 