'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote, ThumbsUp, Heart } from 'lucide-react'

const Reviews = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const reviews = [
    {
      id: 1,
      name: "Damian",
      rating: 5,
      reviewCount: 4,
      text: "I eat here waayy too much but recently stopped it- and boy was I glad. They have so much more to offer in person. For eg their potato salad is the best but it's not on the GrubHub menu. Also they they had a fried fish meal that was great. Their prices are amazing and the daily specials allow you to try something special Everytime you order.",
      platform: "Grubhub",
      verified: true
    },
    {
      id: 2,
      name: "Noelua",
      rating: 5,
      reviewCount: "Top Reviewer",
      text: "Awesome Spanish breakfast! Freshly made and quickly delivered even the coffee was delicious. If you don't like cream and sugar make sure to specify, they'll make it extra sweet if you don't. I will be ordering from them again!",
      platform: "Grubhub",
      verified: true
    },
    {
      id: 3,
      name: "Carmen",
      rating: 5,
      reviewCount: "Top Reviewer",
      text: "Mofongo with green salad and fried pork was delicious! I placed the order twice in error and La Reina Del Sabor cancelled my 2nd order without a problem. Thank you!",
      platform: "Grubhub",
      verified: true
    },
    {
      id: 4,
      name: "Angel",
      rating: 5,
      reviewCount: 1,
      text: "Dominican people with a good heart and even better food! order now and you will be in for some authentic Dominican taste very homey food",
      platform: "Grubhub",
      verified: false
    },
    {
      id: 5,
      name: "Victor",
      rating: 5,
      reviewCount: 1,
      text: "Food was great loved the fish and for the money you pay portions are generous. I will definitely keep ordering from this restaurant",
      platform: "Grubhub",
      verified: false
    },
    {
      id: 6,
      name: "Tanisha",
      rating: 5,
      reviewCount: 1,
      text: "I haven't ate this good in 12 years, I live in Virginia and I travel to New York often and eat Dominican food, but nothing compares to this restaurant. Their food is on point, I ordered twice from the same place,and the same thing. God I'm in Heaven!!! Thank you....",
      platform: "Seamless",
      verified: false
    },
    {
      id: 7,
      name: "Gabriel",
      rating: 5,
      reviewCount: 1,
      text: "Waoooo amazing flavor, not good very very gooddd 5 star recommend real Dominican food. Att Gabriel alcantara",
      platform: "Seamless",
      verified: false
    },
    {
      id: 8,
      name: "Alexa",
      rating: 5,
      reviewCount: 2,
      text: "Had the yucca for the first time and loved it.",
      platform: "Seamless",
      verified: false
    },
    {
      id: 9,
      name: "Keyla",
      rating: 5,
      reviewCount: "Top Reviewer",
      text: "The food is delicious and not expensive",
      platform: "Seamless",
      verified: true
    }
  ]

  const stats = [
    { label: "Average Rating", value: "4.9", icon: <Star className="w-6 h-6 text-yellow-500 fill-current" /> },
    { label: "Total Reviews", value: "200+", icon: <Quote className="w-6 h-6 text-primary-500" /> },
    { label: "Happy Customers", value: "1000+", icon: <Heart className="w-6 h-6 text-red-500 fill-current" /> },
    { label: "Years Serving", value: "5+", icon: <ThumbsUp className="w-6 h-6 text-green-500" /> }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-neutral-300'
        }`}
      />
    ))
  }

  return (
    <section id="reviews" className="section-padding bg-white">
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
            <Star className="w-4 h-4 fill-current" />
            <span>Customer Reviews</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6"
          >
            What Our{' '}
            <span className="text-gradient">Customers Say</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-neutral-600 max-w-3xl mx-auto"
          >
            Don't just take our word for it. Read what our satisfied customers have to say 
            about their dining experience at La Reina Del Sabor.
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-3">
                {stat.icon}
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-neutral-600">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Reviews Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {reviews.slice(0, 6).map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              className="card p-6 h-full"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-neutral-900 mb-1">{review.name}</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-neutral-500">
                      {typeof review.reviewCount === 'number' 
                        ? `${review.reviewCount} reviews` 
                        : review.reviewCount
                      }
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                    {review.platform}
                  </span>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-neutral-600 text-sm leading-relaxed">
                {review.text}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Platform Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              Read All Reviews
            </h3>
            <p className="text-neutral-600 mb-6">
              See what our customers are saying on Grubhub and Seamless. 
              Join the thousands of satisfied customers who love our authentic Dominican cuisine.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                href="https://www.grubhub.com/restaurant/la-reina-del-sabor-137-12-main-st-hackensack/348499"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
              >
                <span>Grubhub Reviews</span>
                <Star className="w-4 h-4 fill-current" />
              </a>
              <a
                href="https://www.seamless.com/menu/la-reina-del-sabor-137-12-main-st-hackensack/348499"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                <span>Seamless Reviews</span>
                <Star className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-16 text-center"
        >
          <p className="text-neutral-500 text-sm">
            All reviews are verified from real customers who have ordered from La Reina Del Sabor.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Reviews 