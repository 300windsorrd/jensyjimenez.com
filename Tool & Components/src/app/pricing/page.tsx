import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import pay from '../../../images/pay.png'
import { ExternalLink, ArrowRight, Sparkles, Gauge, Search, BarChart3, Accessibility, ShieldCheck, Layers } from 'lucide-react'
import Pricing from '@/components/Pricing'

export const metadata: Metadata = {
  title: 'Pricing | Your Agency Name',
  description: 'How our pricing maps to business value — with evidence-backed rationale and sources.'
}

const sections = [
  {
    title: 'Custom Design & Brand Fit',
    icon: Sparkles,
    copy:
      'Tailored interfaces clarify your value proposition and reduce decision friction, increasing conversion versus generic templates.',
    sources: [
      { label: 'Nielsen Norman Group', href: 'https://www.nngroup.com/reports/customization-features/' }
    ]
  },
  {
    title: 'Mobile‑First, Responsive Implementation',
    icon: Gauge,
    copy:
      'Mobile usability directly impacts revenue. Even a 0.1s speed gain can lift conversions, and mobile friendliness affects rankings.',
    sources: [
      { label: 'Think with Google', href: 'https://business.google.com/us/think/' },
      { label: 'Google Mobile‑Friendly', href: 'https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing' }
    ]
  },
  {
    title: 'Performance Optimization',
    icon: Gauge,
    copy:
      'Faster sites reduce bounce and boost engagement. Small latency improvements can yield outsized conversion gains.',
    sources: [
      { label: 'SOASTA/Google Study', href: 'https://think.storage.googleapis.com/docs/mobile-page-speed-new-industry-benchmarks.pdf' },
      { label: 'Page Experience', href: 'https://developers.google.com/search/docs/appearance/page-experience' }
    ]
  },
  {
    title: 'Conversion‑Focused UX',
    icon: Layers,
    copy:
      'Clear IA, strong CTAs, and reduced cognitive load drive task success and sales when aligned to user goals.',
    sources: [
      { label: 'NN/g Articles', href: 'https://www.nngroup.com/articles/' },
      { label: 'Baymard Research', href: 'https://baymard.com/research' }
    ]
  },
  {
    title: 'Technical SEO & Structured Data',
    icon: Search,
    copy:
      'Clean markup, structured data, and Core Web Vitals support discoverability and click‑through from search.',
    sources: [
      { label: 'Page Experience', href: 'https://developers.google.com/search/docs/appearance/page-experience' }
    ]
  },
  {
    title: 'Analytics & Measurement',
    icon: BarChart3,
    copy:
      'Reliable analytics and conversion tracking enable evidence‑based iteration, improving ROAS over time.',
    sources: [
      { label: 'Think with Google', href: 'https://business.google.com/us/think/measurement/' }
    ]
  },
  {
    title: 'Accessibility & Compliance',
    icon: Accessibility,
    copy:
      'Accessible experiences expand your audience, reduce legal risk, and improve usability for everyone.',
    sources: [
      { label: 'WCAG (W3C/WAI)', href: 'https://www.w3.org/WAI/standards-guidelines/wcag/' }
    ]
  },
  {
    title: 'Security, Reliability, & Maintenance',
    icon: ShieldCheck,
    copy:
      'Up‑to‑date dependencies, secure headers, and monitoring protect your brand and minimize downtime costs.',
    sources: [
      { label: 'Google SRE', href: 'https://sre.google/' }
    ]
  },
  {
    title: 'Paid Media Readiness (Google Ads)',
    icon: Search,
    copy:
      'Aligned landing pages, Quality Score factors, and full conversion tracking lower CPA and improve ROAS.',
    sources: [
      { label: 'Quality Score Factors', href: 'https://support.google.com/google-ads/answer/6167118' }
    ]
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-neutral to-white overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" aria-hidden="true"></div>
        <div className="absolute -bottom-24 -left-24 w-[28rem] h-[28rem] bg-accent/10 rounded-full blur-3xl" aria-hidden="true"></div>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
            <div className="max-w-3xl">
              <h1 className="pricing-hero-title text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">Pricing that Pays for Itself</h1>
              <p className="pricing-hero-subtext text-lg md:text-xl text-gray-700 text-balance">
                We invest where it moves the needle: performance, UX, SEO, and analytics. The result is a website that looks incredible, ranks better, and converts more — backed by credible research.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href="#plans" className="btn-primary">
                  View Plans
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
                <a href="#value" className="btn-secondary">See the Value</a>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 flex justify-end">
              <Image
                src={pay}
                alt="Payment value illustration"
                className="h-auto"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Value pillars with inline sources */}
      <section id="value" className="py-12 md:py-16 bg-gray-50">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Where Your Investment Delivers Returns</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Each pillar below maps to measurable outcomes. Explore the source material right beside the claim.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="card p-6 h-full flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-4 flex-1">{item.copy}</p>
                  {item.sources && item.sources.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.sources.map((s, i) => (
                        <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {s.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-16 bg-white">
        <div className="container">
          <Pricing />
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to turn traffic into revenue?</h3>
            <p className="text-lg text-gray-600 mb-6">Let’s build a site that looks world‑class and performs like it. We’ll align scope to outcomes and make the value obvious.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/start" className="btn-primary">
                Start a Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/" className="btn-secondary">Back to Home</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


