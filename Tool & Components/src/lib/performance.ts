// Performance optimization utilities

// Image optimization helper
export const optimizeImage = (src: string, width: number, quality: number = 75) => {
  // For Next.js Image component optimization
  return {
    src,
    width,
    height: Math.round((width * 9) / 16), // Default 16:9 aspect ratio
    quality,
    priority: false,
    loading: 'lazy' as const,
  }
}

// Preload critical images
export const preloadImage = (src: string) => {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  document.head.appendChild(link)
}

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) => {
  if (typeof window === 'undefined') return null
  
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  }
  
  return new IntersectionObserver(callback, defaultOptions)
}

// Debounce function for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof window === 'undefined') {
    fn()
    return
  }
  
  const start = performance.now()
  fn()
  const end = performance.now()
  
  console.log(`${name} took ${end - start}ms`)
}

// Memory usage monitoring
export const getMemoryUsage = () => {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return null
  }
  
  const memory = (performance as any).memory
  return {
    used: Math.round(memory.usedJSHeapSize / 1048576), // MB
    total: Math.round(memory.totalJSHeapSize / 1048576), // MB
    limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
  }
}

// Resource hints for better performance
export const addResourceHints = () => {
  if (typeof document === 'undefined') return
  
  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  ]
  
  hints.forEach(({ rel, href, crossOrigin }) => {
    const link = document.createElement('link')
    link.rel = rel
    link.href = href
    if (crossOrigin) link.crossOrigin = crossOrigin
    document.head.appendChild(link)
  })
}

// Optimize animations based on user preferences
export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Optimize animations for performance
export const getOptimizedAnimationConfig = () => {
  const reducedMotion = shouldReduceMotion()
  
  return {
    duration: reducedMotion ? 0.1 : 0.3,
    ease: reducedMotion ? 'linear' : 'easeOut',
    delay: reducedMotion ? 0 : 0.1,
  }
}

// Cache management
export const cacheKey = (key: string) => `agency-site-${key}`

export const setCache = (key: string, value: any, ttl: number = 3600000) => {
  if (typeof window === 'undefined') return
  
  try {
    const item = {
      value,
      timestamp: Date.now(),
      ttl,
    }
    localStorage.setItem(cacheKey(key), JSON.stringify(item))
  } catch (error) {
    console.warn('Failed to set cache:', error)
  }
}

export const getCache = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const item = localStorage.getItem(cacheKey(key))
    if (!item) return null
    
    const { value, timestamp, ttl } = JSON.parse(item)
    const now = Date.now()
    
    if (now - timestamp > ttl) {
      localStorage.removeItem(cacheKey(key))
      return null
    }
    
    return value
  } catch (error) {
    console.warn('Failed to get cache:', error)
    return null
  }
}

// Bundle size monitoring
export const logBundleSize = () => {
  if (typeof window === 'undefined') return
  
  // Log performance metrics
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  if (navigation) {
    console.log('Page Load Time:', navigation.loadEventEnd - navigation.loadEventStart, 'ms')
    console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, 'ms')
  }
  
  // Log memory usage
  const memory = getMemoryUsage()
  if (memory) {
    console.log('Memory Usage:', memory)
  }
}

// Optimize scroll performance
export const optimizeScroll = (callback: (scrollY: number) => void) => {
  if (typeof window === 'undefined') return () => {}
  
  let ticking = false
  
  const updateScroll = () => {
    callback(window.scrollY)
    ticking = false
  }
  
  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateScroll)
      ticking = true
    }
  }
  
  window.addEventListener('scroll', requestTick, { passive: true })
  
  return () => {
    window.removeEventListener('scroll', requestTick)
  }
}

// Optimize resize performance
export const optimizeResize = (callback: (width: number, height: number) => void) => {
  if (typeof window === 'undefined') return () => {}
  
  let ticking = false
  
  const updateSize = () => {
    callback(window.innerWidth, window.innerHeight)
    ticking = false
  }
  
  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateSize)
      ticking = true
    }
  }
  
  window.addEventListener('resize', requestTick, { passive: true })
  
  return () => {
    window.removeEventListener('resize', requestTick)
  }
}
