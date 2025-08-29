'use client'

import dynamic from 'next/dynamic'

// Dynamically import IntakeForm with ssr: false
const IntakeForm = dynamic(() => import('./IntakeForm'), {
  ssr: false,
  loading: () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="w-32 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="w-full h-12 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

export default function IntakeFormWrapper() {
  return <IntakeForm />
}
