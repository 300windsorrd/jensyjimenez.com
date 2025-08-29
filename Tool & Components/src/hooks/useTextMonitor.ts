import { useEffect, useRef } from 'react'
import { createTextMonitor, validateCleanText } from '@/lib/textUtils'

/**
 * Hook to monitor text content and prevent unwanted periods
 * @param dependencies - Dependencies that trigger re-monitoring
 * @param targetRef - Optional ref to specific element to monitor
 */
export const useTextMonitor = (
  dependencies: any[] = [],
  targetRef?: React.RefObject<HTMLElement | HTMLSpanElement | null>
) => {
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Clean up previous monitor if it exists
    cleanupRef.current?.()

    // Create new monitor
    cleanupRef.current = createTextMonitor('.text-type__content', (element, text) => {
      // Additional validation for specific ref if provided
      if (targetRef?.current && element === targetRef.current) {
        validateCleanText(text, 'target ref')
      }
    })

    // Additional ref-specific monitoring
    if (targetRef?.current) {
      const checkRef = () => {
        const text = targetRef.current?.textContent || ''
        if (!validateCleanText(text, 'ref element')) {
          // Text contains periods, clean it
          const cleanedText = text.replace(/\.+$/, '').trim()
          if (targetRef.current && cleanedText !== text) {
            targetRef.current.textContent = cleanedText
          }
        }
      }

      checkRef()
      const refInterval = setInterval(checkRef, 1000)

      // Enhance cleanup to include ref monitoring
      const originalCleanup = cleanupRef.current
      cleanupRef.current = () => {
        originalCleanup()
        clearInterval(refInterval)
      }
    }

    return () => cleanupRef.current?.()
  }, dependencies)

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanupRef.current?.()
  }, [])
}
