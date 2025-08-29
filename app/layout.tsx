import './globals.css';
import type { ReactNode } from 'react';
import { ThemeProvider, ThemeToggle } from '../components/ThemeProvider';
import { Nav } from '../components/Nav';
import Script from 'next/script';

export const metadata = {
  title: 'Jensy Jimenez',
  description: 'Data, design, and automation that move teams forward.',
};

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jensy Jimenez',
  url: 'https://jensyjimenez.com',
  sameAs: [
    'https://www.linkedin.com/in/jensy-jimenez',
    'https://www.instagram.com/jensy_jimenez/'
  ]
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-bg text-fg antialiased">
        <ThemeProvider>
          <Nav />
          <div className="max-w-3xl mx-auto p-4">
            <div className="flex justify-end"><ThemeToggle /></div>
            {children}
          </div>
        </ThemeProvider>
        <Script id="person-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      </body>
    </html>
  );
}
