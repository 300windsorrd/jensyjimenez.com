'use client'

import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { useBackground } from '@/contexts/BackgroundContext'

const plans = [
  {
    name: 'Basic',
    price: '$1,500',
    description: 'Perfect for small businesses getting started online',
    features: [
      'Custom design (up to 5 pages)',
      'Mobile-responsive layout',
      'Basic SEO optimization',
      'Contact form',
      'Social media integration',
      '2 rounds of revisions',
      'Launch support',
      'Basic analytics setup'
    ],
    popular: false,
    color: 'border-gray-200'
  },
  {
    name: 'Standard',
    price: '$3,000',
    description: 'Ideal for growing businesses with more complex needs',
    features: [
      'Custom design (up to 10 pages)',
      'Mobile-responsive layout',
      'Advanced SEO optimization',
      'Contact form + lead capture',
      'Social media integration',
      'Blog setup',
      'Google Analytics integration',
      '3 rounds of revisions',
      'Priority support',
      'Performance optimization'
    ],
    popular: true,
    color: 'border-primary'
  },
  {
    name: 'Premium',
    price: '$5,000',
    description: 'Comprehensive solution for established businesses',
    features: [
      'Custom design (unlimited pages)',
      'Mobile-responsive layout',
      'Advanced SEO optimization',
      'Advanced forms & integrations',
      'E-commerce functionality',
      'Blog with CMS',
      'Advanced analytics & reporting',
      'Performance optimization',
      'Security hardening',
      'Unlimited revisions',
      'Priority support',
      'Training & documentation'
    ],
    popular: false,
    color: 'border-gray-200'
  }
]

export default function Pricing() {
  const { getButtonColor, getButtonTextColor } = useBackground()
  
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that best fits your business needs and budget. 
            All plans include custom design, mobile optimization, and ongoing support.
          </p>
          <div className="mt-6">
            <a
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-800 font-semibold rounded-lg hover:border-gray-400 transition-all duration-200"
            >
              Why is this valuable?
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl border-2 ${plan.color} ${
                plan.popular 
                  ? 'bg-primary/5 shadow-xl scale-105' 
                  : 'bg-white shadow-lg hover:shadow-xl'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center"
                       style={{ backgroundColor: getButtonColor() }}>
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/project</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <a
                  href="#start-project"
                  className={`inline-block w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                  style={plan.popular ? ({ 
                    backgroundColor: getButtonColor(),
                    color: getButtonTextColor(),
                    ['--tw-shadow-color' as any]: getButtonColor(),
                    ['--tw-shadow' as any]: `0 4px 6px -1px ${getButtonColor()}40, 0 2px 4px -1px ${getButtonColor()}40`
                  } as React.CSSProperties) : {}}
                >
                  Start Project
                </a>
              </div>
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
          <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Something Custom?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Every business is unique. If you need a custom solution that doesn't fit our standard plans, 
              let's discuss your specific requirements and create a tailored proposal.
            </p>
            <a
              href="/start"
              className="inline-flex items-center px-8 py-3 text-white font-semibold rounded-lg transition-colors"
              style={({ 
                backgroundColor: getButtonColor(),
                color: getButtonTextColor(),
                ['--tw-shadow-color' as any]: getButtonColor(),
                ['--tw-shadow' as any]: `0 4px 6px -1px ${getButtonColor()}40, 0 2px 4px -1px ${getButtonColor()}40`
              } as React.CSSProperties)}
            >
              Discuss Custom Project
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
