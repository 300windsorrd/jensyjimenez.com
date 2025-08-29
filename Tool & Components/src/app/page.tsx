import { Metadata } from 'next'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import LazyVisible from '@/components/LazyVisible'
import SimpleIntakeForm from '@/components/SimpleIntakeForm'

export const metadata: Metadata = {
  title: 'Professional Web Design Services - Transform Your Business',
  description: 'Get a custom website that converts visitors into customers. Professional web design services with modern, responsive designs tailored to your business needs.',
  keywords: ['web design', 'website development', 'custom websites', 'business websites', 'responsive design'],
  openGraph: {
    title: 'Professional Web Design Services - Transform Your Business',
    description: 'Get a custom website that converts visitors into customers. Professional web design services with modern, responsive designs.',
    type: 'website',
    url: 'https://yourdomain.com',
    images: ['/api/og?title=Web%20Design%20Services'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Web Design Services - Transform Your Business',
    description: 'Get a custom website that converts visitors into customers.',
    images: ['/api/og?title=Web%20Design%20Services'],
  },
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <LazyVisible>
        <Features />
      </LazyVisible>
      {/* Testimonials section removed */}
      
      {/* Intake Form Section */}
      <section id="start-project" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Start Your Project
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tell us about your business and vision. We'll create a custom website that perfectly represents your brand and drives results.
            </p>
          </div>
          
          <SimpleIntakeForm />
        </div>
      </section>
    </div>
  )
}
