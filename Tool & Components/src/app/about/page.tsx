import { Metadata } from 'next'
import ThreadsBackground from '@/components/ThreadsBackground'
import Image from 'next/image'
import JensyPic from '../../../images/Jensy.jpeg'
import EthanPic from '../../../images/Ethan.jpeg'
import KasaiPic from '../../../images/Kasai.jpeg'

export const metadata: Metadata = {
  title: 'About Us - Professional Web Design Agency',
  description: 'Learn about our team, mission, and commitment to delivering exceptional web design services that transform businesses and drive results.',
  keywords: ['about us', 'web design agency', 'team', 'mission', 'values'],
  openGraph: {
    title: 'About Us - Professional Web Design Agency',
    description: 'Learn about our team, mission, and commitment to delivering exceptional web design services.',
    type: 'website',
    url: 'https://yourdomain.com/about',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 text-black overflow-hidden">
        {/* Threads Background */}
        <ThreadsBackground 
          color={[0.6, 0.75, 1]} 
          amplitude={2} 
          distance={0.5}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About Our Agency</h1>
            <p className="text-xl text-black max-w-2xl mx-auto">
              We're passionate about creating websites that don't just look great, but drive real business results.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 relative z-[-1]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                To empower businesses with stunning, high-converting websites that establish their digital presence 
                and drive sustainable growth in an ever-evolving online landscape.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">We stay ahead of the curve with cutting-edge design trends and technologies.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality</h3>
                <p className="text-gray-600">Every project is crafted with attention to detail and excellence.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Partnership</h3>
                <p className="text-gray-600">We work closely with our clients to ensure their vision becomes reality.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
              <p className="text-xl text-gray-600">
                Our talented team of designers, developers, and strategists work together to deliver exceptional results.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Image
                  src={JensyPic}
                  alt="Portrait of Jensy Jimenez"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  sizes="96px"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <a href="https://www.linkedin.com/in/jensy-jimenez/" target="_blank" rel="noopener noreferrer" className="hover:underline">Jensy Jimenez</a>
                  <span className="ml-2 inline-block px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700 align-middle">Founder</span>
                </h3>
                <div className="mb-3">
                  <a
                    href="https://www.linkedin.com/in/jensy-jimenez/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                  >
                    LinkedIn
                  </a>
                </div>
                <p className="text-blue-600 mb-3">Lead Full Stack Developer, Data Scientist, and Operations Manager.</p>
                <p className="text-gray-600 text-sm">
                  Seeing a need in his community and with a desire to help, Jensy Jimenez founded Bite Sites to bring value, mobile presence, and customizability to small and large businesses alike.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Image
                  src={EthanPic}
                  alt="Portrait of Ethan Kurtz"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  sizes="96px"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <a href="https://www.linkedin.com/in/ethan-kurtz/" target="_blank" rel="noopener noreferrer" className="hover:underline">Ethan Kurtz</a>
                </h3>
                <div className="mb-3">
                  <a
                    href="https://www.linkedin.com/in/ethan-kurtz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                  >
                    LinkedIn
                  </a>
                </div>
                <p className="text-blue-600 mb-3">Lead Risk Management Officer, Front End Developer</p>
                <p className="text-gray-600 text-sm">
                  With years of experience in Risk Management and Expertise in Psychology and Business Management, Ethan Kurtz brings to the table a breadth of knowledge to propel Bite Sites into competitive spaces in the web development ecosystem.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Image
                  src={KasaiPic}
                  alt="Portrait of Kasai Sanchez"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  sizes="96px"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <a href="https://www.linkedin.com/in/kasai-sanchez-083207307/" target="_blank" rel="noopener noreferrer" className="hover:underline">Kasai Sanchez</a>
                </h3>
                <div className="mb-3">
                  <a
                    href="https://www.linkedin.com/in/kasai-sanchez-083207307/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                  >
                    LinkedIn
                  </a>
                </div>
                <p className="text-blue-600 mb-3">Experience Director, Customer Engagement Lead</p>
                <p className="text-gray-600 text-sm">
                  An award winning Community Organizer and Social Justice Activist, who believes in granting people the tools necessary to grow both personally and professionally, Kasai Sanchez gracefully brings BiteSites a client tailored approach to web development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
              <p className="text-xl text-gray-600">
                These core values guide everything we do and how we serve our clients.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Passion for Excellence</h3>
                  <p className="text-gray-600">We're passionate about creating exceptional websites that make a lasting impact.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Timely Delivery</h3>
                  <p className="text-gray-600">We respect your time and always deliver projects on schedule.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Open Communication</h3>
                  <p className="text-gray-600">We believe in transparent communication and keeping you informed every step of the way.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
                  <p className="text-gray-600">We constantly explore new technologies and design trends to stay ahead of the curve.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 text-black overflow-hidden">
        {/* Threads Background */}
        <ThreadsBackground 
          color={[0.6, 0.75, 1]} 
          amplitude={2} 
          distance={0.5}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Work Together?</h2>
            <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
              Let's discuss your project and see how we can help bring your vision to life.
            </p>
            <a
              href="/#start-project"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Start Your Project
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}


