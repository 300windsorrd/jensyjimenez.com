'use client'

import Threads from '@/Backgrounds/Threads/Threads.jsx'

interface ThreadsBackgroundProps {
  color?: [number, number, number]
  amplitude?: number
  distance?: number
  className?: string
}

export default function ThreadsBackground({ 
  color = [0.2, 0.45, 1], 
  amplitude = 2, 
  distance = 0.5,
  className = "w-full h-full"
}: ThreadsBackgroundProps) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Threads 
        color={color} 
        amplitude={amplitude} 
        distance={distance}
        className={className}
      />
    </div>
  )
}
