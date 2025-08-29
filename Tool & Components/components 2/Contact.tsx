'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { MapPin, Phone, Clock, Navigation, Car, Utensils } from 'lucide-react'

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: "137 1/2 Main St, Hackensack, NJ 07601",
      action: "Get Directions",
      actionLink: "https://www.google.com/maps/place/137%201/2%20Main%20St,%20Hackensack,%20NJ%2007601",
      color: "primary"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: "(201) 880-5153",
      action: "Call Now",
      actionLink: "tel:+12018805153",
      color: "secondary"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Hours",
      details: "Daily: 7:30 AM - 8:00 PM",
      action: "View Full Hours",
      actionLink: "#about",
      color: "accent"
    }
  ]

  const services = [
    {
      icon: <Car className="w-6 h-6" />,
      title: "Delivery",
      description: "Fast delivery to your door",
      hours: "8:00 AM - 8:00 PM"
    },
    {
      icon: <Utensils className="w-6 h-6" />,
      title: "Takeout",
      description: "Quick pickup available",
      hours: "7:30 AM - 8:00 PM"
    },
    {
      icon: <Navigation className="w-6 h-6" />,
      title: "Catering",
      description: "Special events & parties",
      hours: "Advance notice required"
    }
  ]

  return (
    <section id="contact" className="section-padding bg-gradient-to-br from-neutral-50 to-white">
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
            <MapPin className="w-4 h-4" />
            <span>Location & Contact</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6"
          >
            Find Us in{' '}
            <span className="text-gradient">Hackensack</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-neutral-600 max-w-3xl mx-auto"
          >
            Conveniently located in the heart of Hackensack, we're easy to find and ready to serve you 
            with the most authentic Dominican cuisine in the area.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                  className="card p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-${info.color}-100 rounded-lg flex items-center justify-center text-${info.color}-600 flex-shrink-0`}>
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-neutral-900 mb-2">
                        {info.title}
                      </h4>
                      <p className="text-neutral-600 mb-3">
                        {info.details}
                      </p>
                      <a
                        href={info.actionLink}
                        target={info.actionLink.startsWith('http') ? '_blank' : '_self'}
                        rel={info.actionLink.startsWith('http') ? 'noopener noreferrer' : ''}
                        className={`inline-flex items-center space-x-2 text-${info.color}-600 hover:text-${info.color}-700 font-medium transition-colors duration-200`}
                      >
                        <span>{info.action}</span>
                        <Navigation className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">Our Services</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                    className="bg-white rounded-lg p-4 border border-neutral-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                        {service.icon}
                      </div>
                      <h4 className="font-semibold text-neutral-900">{service.title}</h4>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">{service.description}</p>
                    <p className="text-xs text-neutral-500 font-medium">{service.hours}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white text-center"
            >
              <h4 className="text-xl font-bold mb-3">Ready to Order?</h4>
              <p className="text-primary-100 mb-4">
                Get authentic Dominican cuisine delivered to your door or ready for pickup.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <a
                  href="https://www.grubhub.com/restaurant/la-reina-del-sabor-137-12-main-st-hackensack/348499"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200"
                >
                  Order Online
                </a>
                <a
                  href="tel:+12018805153"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
                >
                  Call to Order
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="space-y-6"
          >
            {/* Map Container */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Our Location</h3>
              <div className="w-full h-80 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-neutral-900">137 1/2 Main St</p>
                  <p className="text-neutral-600">Hackensack, NJ 07601</p>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/place/137%201/2%20Main%20St,%20Hackensack,%20NJ%2007601"
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full justify-center"
              >
                Get Directions
              </a>
            </div>

            {/* Quick Info */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                  <span className="font-medium text-neutral-700">Cuisine</span>
                  <span className="text-neutral-900">Dominican</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                  <span className="font-medium text-neutral-700">Price Range</span>
                  <span className="text-neutral-900">$3 - $30</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                  <span className="font-medium text-neutral-700">Payment</span>
                  <span className="text-neutral-900">Cash, Card, Online</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-neutral-700">Parking</span>
                  <span className="text-neutral-900">Street Parking</span>
                </div>
              </div>
            </div>

            {/* Neighborhood Info */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">In the Neighborhood</h3>
              <p className="text-neutral-600 mb-4">
                Located in the heart of Hackensack, we're easily accessible from major highways 
                and surrounded by local businesses and residential areas.
              </p>
              <div className="text-sm text-neutral-500">
                <p>• Near Hackensack University Medical Center</p>
                <p>• Close to Route 4 and Route 17</p>
                <p>• Easy access from Bergen County</p>
                <p>• Free street parking available</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact 