'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, Bloom & Blossom',
    content: 'Our new website has completely transformed our business. The design perfectly captures our brand essence, and we\'ve seen a 40% increase in online bookings since launch.',
    rating: 5,
    image: '/api/placeholder/60/60'
  },
  {
    name: 'Michael Chen',
    role: 'Founder, TechFlow Solutions',
    content: 'Professional, responsive, and results-driven. The team delivered exactly what we needed - a modern website that converts visitors into clients. Highly recommended!',
    rating: 5,
    image: '/api/placeholder/60/60'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Owner, Coastal Cafe',
    content: 'The custom design process was seamless and the final result exceeded our expectations. Our customers love the new online ordering system and mobile experience.',
    rating: 5,
    image: '/api/placeholder/60/60'
  },
  {
    name: 'David Thompson',
    role: 'Marketing Director, GreenTech',
    content: 'Outstanding attention to detail and a deep understanding of our business goals. The website not only looks amazing but has significantly improved our lead generation.',
    rating: 5,
    image: '/api/placeholder/60/60'
  },
  {
    name: 'Lisa Park',
    role: 'Creative Director, Studio Luxe',
    content: 'Working with this team was a pleasure from start to finish. They truly understand design and user experience, delivering a website that perfectly represents our brand.',
    rating: 5,
    image: '/api/placeholder/60/60'
  },
  {
    name: 'Robert Kim',
    role: 'Founder, Fitness First',
    content: 'The mobile-first approach and conversion optimization have made a huge difference. Our membership signups increased by 60% in the first month after launch.',
    rating: 5,
    image: '/api/placeholder/60/60'
  }
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what business owners say about working with us 
            and the results they've achieved.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="relative">
                <Quote className="absolute -top-2 -left-1 w-6 h-6 text-gray-300" />
                <p className="text-gray-700 leading-relaxed pl-6">
                  {testimonial.content}
                </p>
              </blockquote>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <span className="text-2xl font-bold text-primary">4.9</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-lg">from 200+ reviews</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
