/**
 * Text utility functions for cleaning and validating text content
 */

/**
 * Removes trailing periods and cleans text
 * @param text - The text to clean
 * @returns Cleaned text without trailing periods
 */
export const cleanText = (text: string): string => {
  if (!text || typeof text !== 'string') return text
  
  // Remove any trailing periods and trim whitespace
  return text
    .replace(/\.+$/, '')           // Remove trailing periods
    .replace(/\.+(\s|$)/g, '$1')   // Remove multiple consecutive periods
    .trim()                        // Trim whitespace
}

/**
 * Validates that text doesn't contain unwanted periods
 * @param text - The text to validate
 * @param context - Context for logging (optional)
 * @returns true if text is clean, false if periods are found
 */
export const validateCleanText = (text: string, context?: string): boolean => {
  if (text.includes('.')) {
    console.warn(`Period detected in text${context ? ` (${context})` : ''}:`, text)
    return false
  }
  return true
}

/**
 * Creates a DOM monitor to watch for unwanted periods in text content
 * @param selector - CSS selector for elements to monitor
 * @param onPeriodDetected - Callback when periods are found
 * @returns Cleanup function
 */
export const createTextMonitor = (
  selector: string = '.text-type__content',
  onPeriodDetected?: (element: Element, text: string) => void
): (() => void) => {
  const checkForPeriods = () => {
    const elements = document.querySelectorAll(selector)
    elements.forEach((element) => {
      const text = element.textContent || ''
      if (text.includes('.')) {
        console.warn('Period detected in DOM text:', text)
        
        // Try to clean the text
        const cleanedText = cleanText(text)
        if (cleanedText !== text) {
          element.textContent = cleanedText
        }
        
        // Call custom callback if provided
        onPeriodDetected?.(element, text)
      }
    })
  }

  // Check immediately
  checkForPeriods()
  
  // Set up periodic checking
  const interval = setInterval(checkForPeriods, 1000)
  
  // Set up MutationObserver for real-time monitoring
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        checkForPeriods()
      }
    })
  })
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  })
  
  // Return cleanup function
  return () => {
    clearInterval(interval)
    observer.disconnect()
  }
}
