import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Reviews - Professional Web Design Agency',
  description: 'Read what our clients have to say about our web design services. Real testimonials from satisfied customers who have transformed their online presence.',
  keywords: ['client reviews', 'testimonials', 'customer feedback', 'web design reviews'],
  openGraph: {
    title: 'Client Reviews - Professional Web Design Agency',
    description: 'Read what our clients have to say about our web design services.',
    type: 'website',
    url: 'https://yourdomain.com/reviews',
  },
}

export default function ReviewsPage() {
  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      company: 'TechStart Inc.',
      role: 'CEO',
      rating: 5,
      content: 'Working with this agency was an absolute pleasure. They transformed our outdated website into a modern, high-converting platform that has increased our leads by 300%. The team was professional, responsive, and delivered beyond our expectations.',
      image: 'SJ',
      color: 'from-blue-400 to-purple-500'
    },
    {
      id: 2,
      name: 'Michael Chen',
      company: 'GreenEats Restaurant',
      role: 'Owner',
      rating: 5,
      content: 'The website they created for our restaurant is stunning and functional. Our online orders have increased significantly, and customers love the easy-to-use interface. Highly recommend their services!',
      image: 'MC',
      color: 'from-green-400 to-blue-500'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      company: 'Fashion Forward',
      role: 'Creative Director',
      rating: 5,
      content: 'They perfectly captured our brand aesthetic and created a website that showcases our products beautifully. The e-commerce integration is seamless, and our sales have grown tremendously since the launch.',
      image: 'ER',
      color: 'from-pink-400 to-purple-500'
    },
    {
      id: 4,
      name: 'David Thompson',
      company: 'Thompson Law Firm',
      role: 'Managing Partner',
      rating: 5,
      content: 'Professional, reliable, and exceptional quality. They built us a website that reflects our firm\'s professionalism while being easy to navigate. Our client inquiries have increased by 200%.',
      image: 'DT',
      color: 'from-gray-400 to-blue-500'
    },
    {
      id: 5,
      name: 'Lisa Wang',
      company: 'Wellness Studio',
      role: 'Founder',
      rating: 5,
      content: 'The team understood our vision perfectly and created a calming, professional website that attracts the right clients. The booking system integration works flawlessly, and our business has grown significantly.',
      image: 'LW',
      color: 'from-teal-400 to-green-500'
    },
    {
      id: 6,
      name: 'Robert Martinez',
      company: 'Martinez Construction',
      role: 'President',
      rating: 5,
      content: 'They built us a website that showcases our projects beautifully and makes it easy for potential clients to contact us. The mobile responsiveness is perfect, and we\'ve seen a huge increase in project inquiries.',
      image: 'RM',
      color: 'from-orange-400 to-red-500'
    }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">What Our Clients Say</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients have to say about their experience working with us.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
                <div className="text-gray-600">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">4.9/5</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
                <div className="text-gray-600">Repeat Clients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Client Testimonials</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Real feedback from real clients who have experienced the difference our services make.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {renderStars(review.rating)}
                  </div>

                  {/* Review Content */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    "{review.content}"
                  </p>

                  {/* Client Info */}
                  <div className="flex items-center">
                    <div className={`w-12 h-12 bg-gradient-to-r ${review.color} rounded-full flex items-center justify-center mr-4`}>
                      <span className="text-white font-semibold text-sm">{review.image}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{review.name}</div>
                      <div className="text-sm text-gray-600">{review.role}</div>
                      <div className="text-sm text-blue-600">{review.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Review */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  {renderStars(5)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Featured Client Story</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    "When we first approached this agency, we had a vision but no clear path to achieve it. 
                    They not only understood our business goals but exceeded our expectations in every way. 
                    Our new website has transformed our online presence and directly contributed to a 400% 
                    increase in qualified leads. The team's attention to detail, creative vision, and 
                    technical expertise is unmatched."
                  </p>
                  
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-lg">AJ</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">Alex Johnson</div>
                      <div className="text-gray-600">CEO & Founder</div>
                      <div className="text-blue-600 font-medium">InnovateTech Solutions</div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                    <div className="text-3xl font-bold mb-2">400%</div>
                    <div className="text-blue-100">Increase in Qualified Leads</div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    Results achieved within 6 months of website launch
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Clients Choose Us</h2>
              <p className="text-xl text-gray-600">
                Our commitment to excellence and client satisfaction sets us apart.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">On-Time Delivery</h3>
                <p className="text-gray-600">We respect deadlines and always deliver projects on schedule.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Clear Communication</h3>
                <p className="text-gray-600">We keep you informed throughout the entire process.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
                <p className="text-gray-600">We stand behind our work with a satisfaction guarantee.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Join Our Happy Clients?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Let's create something amazing together and add your success story to our collection.
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
    </main>
  )
}


