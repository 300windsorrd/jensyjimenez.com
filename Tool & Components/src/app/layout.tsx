import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import SkipLink from '@/components/SkipLink'
import Footer from '@/components/Footer'
import { BackgroundProvider } from '@/contexts/BackgroundContext'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    default: 'Professional Web Design Services - Transform Your Business',
    template: '%s | Professional Web Design Services'
  },
  description: 'Get a custom website that converts visitors into customers. Professional web design services with modern, responsive designs tailored to your business needs.',
  keywords: ['web design', 'website development', 'custom websites', 'business websites', 'responsive design'],
  authors: [{ name: 'Your Agency Name' }],
  creator: 'Your Agency Name',
  publisher: 'Your Agency Name',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bitesites.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bitesites.org',
    siteName: 'Professional Web Design Services',
    title: 'Professional Web Design Services - Transform Your Business',
    description: 'Get a custom website that converts visitors into customers. Professional web design services with modern, responsive designs.',
    images: [
      {
        url: '/api/og?title=Web%20Design%20Services',
        width: 1200,
        height: 630,
        alt: 'Professional Web Design Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@youragency',
    creator: '@youragency',
    title: 'Professional Web Design Services - Transform Your Business',
    description: 'Get a custom website that converts visitors into customers.',
    images: ['/api/og?title=Web%20Design%20Services'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0b0b0c" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        {/* Preconnects for font delivery to improve CLS */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        {/* Organization JSON-LD for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: 'Your Agency Name',
              url: 'https://bitesites.org',
              logo: '/favicon.png'
            })
          }}
        />
        {/* WebSite & BreadcrumbList & FAQ JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: 'Your Agency Name',
              url: 'https://bitesites.org',
              potentialAction: {
                "@type": "SearchAction",
                target: 'https://bitesites.org/?q={search_term_string}',
                "query-input": 'required name=search_term_string'
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: 'Home', item: 'https://bitesites.org/' },
                { "@type": "ListItem", position: 2, name: 'Pricing', item: 'https://bitesites.org/pricing' },
                { "@type": "ListItem", position: 3, name: 'Start', item: 'https://bitesites.org/start' }
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: 'How long does a project take?',
                  acceptedAnswer: { "@type": "Answer", text: 'Most sites launch in 3–6 weeks depending on scope.' }
                },
                {
                  "@type": "Question",
                  name: 'Do you offer ongoing support?',
                  acceptedAnswer: { "@type": "Answer", text: 'Yes, we offer maintenance plans and support SLAs.' }
                }
              ]
            })
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = saved || (prefersDark ? 'dark' : 'light');
                  var root = document.documentElement;
                  root.dataset.theme = theme;
                  root.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
                  if (theme === 'dark') root.classList.add('dark');
                  else root.classList.remove('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <BackgroundProvider>
          <SkipLink />
          <header role="banner">
            <Navigation />
          </header>
          <main id="content" role="main">
            {children}
          </main>
          <footer role="contentinfo">
            <Footer />
          </footer>
        </BackgroundProvider>
      </body>
    </html>
  )
}
