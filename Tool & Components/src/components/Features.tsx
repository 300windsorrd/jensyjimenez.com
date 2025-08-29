'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Smartphone, Zap, Target, Users, Shield } from 'lucide-react'
import MagicBento from '@/components/MagicBento/MagicBento.jsx'
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack/ScrollStack.jsx'
import ChromaGrid from '@/components/ChromaGrid/ChromaGrid.jsx'
import LayoutPicker from '@/components/LayoutPicker'

const features = [
  {
    icon: Palette,
    title: 'Custom Design',
    description: 'Every website is uniquely designed to match your brand identity and business goals. No templates, no cookie-cutter solutions.',
    color: 'text-blue-600'
  },
  {
    icon: Smartphone,
    title: 'Mobile-First',
    description: 'Responsive design that looks and works perfectly on all devices, from smartphones to desktop computers.',
    color: 'text-green-600'
  },
  {
    icon: Zap,
    title: 'Fast Performance',
    description: 'Optimized for speed and performance, ensuring your visitors have the best possible experience.',
    color: 'text-yellow-600'
  },
  {
    icon: Target,
    title: 'Conversion Focused',
    description: 'Designed with your business goals in mind, optimized to convert visitors into customers.',
    color: 'text-red-600'
  },
  {
    icon: Users,
    title: 'User Experience',
    description: 'Intuitive navigation and user-friendly interfaces that keep visitors engaged and coming back.',
    color: 'text-purple-600'
  },
  {
    icon: Shield,
    title: 'SEO Optimized',
    description: 'Built with search engine optimization in mind, helping your website rank higher in search results.',
    color: 'text-indigo-600'
  }
]

export default function Features() {
  const [layout, setLayout] = useState<'grid' | 'magic-bento' | 'scroll-stack' | 'chroma-grid'>('grid')

  const palette = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  const bentoItems = useMemo(
    () =>
      features.map((f, i) => ({
        color: '#ffffff',
        title: f.title,
        description: f.description,
        label: 'Feature',
        icon: f.icon,
        iconColor: f.color
      })),
    []
  )

  const chromaItems = useMemo(
    () =>
      features.map((f, i) => ({
        icon: f.icon,
        iconColor: f.color,
        title: f.title,
        subtitle: f.description,
        handle: '',
        borderColor: palette[i % palette.length],
        gradient: `linear-gradient(165deg, ${palette[i % palette.length]}, #000)`,
        url: '#start-project'
      })),
    []
  )

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Web Design Services?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine creativity with technical expertise to deliver websites that not only look great 
            but also drive real business results.
          </p>
        </motion.div>

        <div className="mb-10 flex items-center justify-center">
          <label htmlFor="features-layout" className="sr-only">Layout</label>
          <select
            id="features-layout"
            className="sr-only"
            value={layout}
            onChange={(e) => setLayout(e.target.value as any)}
          >
            <option value="grid">Grid</option>
            <option value="magic-bento">Magic Bento</option>
            <option value="scroll-stack">Scroll Stack</option>
            <option value="chroma-grid">Chroma Grid</option>
          </select>
          <LayoutPicker current={layout} onPick={(l) => setLayout(l as any)} />
        </div>

        {layout === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {layout === 'magic-bento' && (
          <div className="mt-6">
            <MagicBento
              items={bentoItems}
              enableStars={false}
              enableTilt={false}
              enableMagnetism={false}
              enableSpotlight
              enableBorderGlow
              textAutoHide={false}
              spotlightRadius={360}
            />
          </div>
        )}

        {layout === 'scroll-stack' && (
          <div className="mt-6">
            <ScrollStack onStackComplete={() => {}}>
              {features.map((f, i) => (
                <ScrollStackItem key={i}>
                  <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <f.icon className={`w-6 h-6 ${f.color}`} />
                    </div>
                    <div className="text-xl font-semibold text-gray-900 mb-2">{f.title}</div>
                    <p className="text-gray-600 leading-relaxed">{f.description}</p>
                  </div>
                </ScrollStackItem>
              ))}
            </ScrollStack>
          </div>
        )}

        {layout === 'chroma-grid' && (
          <div className="mt-6">
            <ChromaGrid items={chromaItems} columns={3} rows={2} />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary to-accent p-8 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Transform Your Online Presence?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Let's discuss your project and create something amazing together.
            </p>
            <a
              href="#start-project"
              className="inline-flex items-center px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Your Project
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
