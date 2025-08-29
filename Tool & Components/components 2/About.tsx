'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { MapPin, Phone, Clock, Utensils, Heart, Users } from 'lucide-react'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Made with Love",
      description: "Every dish is prepared with the same care and attention as if we were cooking for our own family."
    },
    {
      icon: <Utensils className="w-6 h-6" />,
      title: "Authentic Recipes",
      description: "Our recipes have been passed down through generations, preserving the true taste of Dominican cuisine."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Family Tradition",
      description: "We're proud to bring the warm hospitality and rich flavors of Dominican culture to Hackensack."
    }
  ]

  const hours = [
    { day: "Monday", delivery: "7:00 AM - 8:00 PM", takeout: "7:30 AM - 8:00 PM" },
    { day: "Tuesday", delivery: "7:00 AM - 8:00 PM", takeout: "7:30 AM - 8:00 PM" },
    { day: "Wednesday", delivery: "7:00 AM - 8:00 PM", takeout: "7:30 AM - 8:00 PM" },
    { day: "Thursday", delivery: "7:00 AM - 8:00 PM", takeout: "7:30 AM - 8:00 PM" },
    { day: "Friday", delivery: "7:00 AM - 8:00 PM", takeout: "7:30 AM - 8:00 PM" },
    { day: "Saturday", delivery: "8:00 AM - 8:00 PM", takeout: "8:00 AM - 8:00 PM" },
    { day: "Sunday", delivery: "8:00 AM - 4:00 PM", takeout: "8:00 AM - 4:00 PM" }
  ]

  return (
    <section id="about" className="section-padding bg-gradient-to-br from-neutral-50 to-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Our Story</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6"
            >
              Bringing{' '}
              <span className="text-gradient">Dominican Flavors</span> to{' '}
              <span className="text-gradient">Hackensack</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-neutral-600 mb-8 leading-relaxed"
            >
              La Reina Del Sabor was born from a simple dream: to share the authentic flavors 
              and warm hospitality of Dominican culture with our community in Hackensack. 
              What started as a family kitchen has grown into a beloved local destination 
              where every meal tells a story of tradition, love, and the rich culinary heritage 
              of the Dominican Republic.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-lg text-neutral-600 mb-8 leading-relaxed"
            >
              Our commitment to quality ingredients, traditional cooking methods, and 
              genuine care for our customers has made us the go-to spot for authentic 
              Dominican cuisine. Whether you're craving the comfort of mangu for breakfast 
              or the rich flavors of pernil for dinner, we're here to bring a taste of 
              home to your table.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="space-y-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-neutral-600">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="card p-6"
            >
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="font-medium text-neutral-900">Address</p>
                    <a 
                      href="https://www.google.com/maps/place/137%201/2%20Main%20St,%20Hackensack,%20NJ%2007601"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                    >
                      137 1/2 Main St, Hackensack, NJ 07601
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="font-medium text-neutral-900">Phone</p>
                    <a 
                      href="tel:+12018805153"
                      className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                    >
                      (201) 880-5153
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Utensils className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="font-medium text-neutral-900">Cuisine</p>
                    <p className="text-neutral-600">Breakfast, Dinner, Dominican</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="card p-6"
            >
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Hours of Operation</h3>
              <div className="space-y-3">
                {hours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-b-0">
                    <span className="font-medium text-neutral-900">{schedule.day}</span>
                    <div className="text-right text-sm">
                      <div className="text-neutral-600">Delivery: {schedule.delivery}</div>
                      <div className="text-neutral-600">Takeout: {schedule.takeout}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white text-center"
            >
              <h4 className="text-xl font-bold mb-3">Ready to Taste the Difference?</h4>
              <p className="text-primary-100 mb-4">
                Order now and experience authentic Dominican cuisine delivered to your door.
              </p>
              <a
                href="https://www.grubhub.com/restaurant/la-reina-del-sabor-137-12-main-st-hackensack/348499"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200"
              >
                Order Now
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About 