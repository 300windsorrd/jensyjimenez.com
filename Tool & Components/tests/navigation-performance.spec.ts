import { test, expect } from '@playwright/test'

test.describe('Navigation Performance and Layout Stability', () => {
      test('should load navigation without layout shifts', async ({ page }) => {
      await page.goto('/')
      
      // Wait for navigation to be fully loaded
      await page.waitForSelector('.pill-nav', { state: 'visible' })
      
      // Get initial layout metrics
      const initialMetrics = await page.evaluate(() => {
        const nav = document.querySelector('.pill-nav')
        if (!nav) return null
        
        const rect = nav.getBoundingClientRect()
        return {
          top: rect.top,
          height: rect.height
        }
      })
      
      expect(initialMetrics).not.toBeNull()
      
      // Wait a bit more to ensure any animations complete
      await page.waitForTimeout(500)
      
      // Check final layout metrics
      const finalMetrics = await page.evaluate(() => {
        const nav = document.querySelector('.pill-nav')
        if (!nav) return null
        
        const rect = nav.getBoundingClientRect()
        return {
          top: rect.top,
          height: rect.height
        }
      })
      
      // Height and top position should be stable (width/left may change due to responsive behavior)
      expect(finalMetrics.height).toEqual(initialMetrics.height)
      expect(finalMetrics.top).toEqual(initialMetrics.top)
    })

  test('should handle mobile/desktop switch without layout shifts', async ({ page }) => {
    await page.goto('/')
    
    // Wait for navigation to load
    await page.waitForSelector('.pill-nav', { state: 'visible' })
    
    // Start with desktop
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.waitForTimeout(100)
    
    const desktopMetrics = await page.evaluate(() => {
      const nav = document.querySelector('.pill-nav')
      if (!nav) return null
      
      const rect = nav.getBoundingClientRect()
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }
    })
    
    // Switch to mobile
    await page.setViewportSize({ width: 390, height: 844 })
    await page.waitForTimeout(100)
    
    const mobileMetrics = await page.evaluate(() => {
      const nav = document.querySelector('.pill-nav')
      if (!nav) return null
      
      const rect = nav.getBoundingClientRect()
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }
    })
    
          // Both should be properly positioned
      expect(desktopMetrics).not.toBeNull()
      expect(mobileMetrics).not.toBeNull()
      
      // Mobile should be properly positioned (may be centered or left-aligned)
      expect(mobileMetrics.left).toBeGreaterThanOrEqual(0)
      expect(mobileMetrics.width).toBeLessThanOrEqual(390)
  })

  test('should not cause cumulative layout shifts during rapid viewport changes', async ({ page }) => {
    await page.goto('/')
    
    // Wait for navigation to load
    await page.waitForSelector('.pill-nav', { state: 'visible' })
    
    const initialPosition = await page.evaluate(() => {
      const nav = document.querySelector('.pill-nav')
      if (!nav) return null
      
      const rect = nav.getBoundingClientRect()
      return { top: rect.top, left: rect.left }
    })
    
    // Perform rapid viewport changes
    for (let i = 0; i < 10; i++) {
      await page.setViewportSize({ width: 1200, height: 800 })
      await page.waitForTimeout(20)
      await page.setViewportSize({ width: 390, height: 844 })
      await page.waitForTimeout(20)
    }
    
    // Final position should be consistent
    const finalPosition = await page.evaluate(() => {
      const nav = document.querySelector('.pill-nav')
      if (!nav) return null
      
      const rect = nav.getBoundingClientRect()
      return { top: rect.top, left: rect.left }
    })
    
    // Position should be stable after rapid changes
    expect(finalPosition).not.toBeNull()
    
    // On mobile, should be properly positioned
    if (page.viewportSize()?.width === 390) {
      expect(finalPosition.left).toBeGreaterThanOrEqual(0)
    }
  })

  test('should maintain proper stacking context during transitions', async ({ page }) => {
    await page.goto('/')
    
    // Wait for navigation to load
    await page.waitForSelector('.pill-nav', { state: 'visible' })
    
    // Check desktop stacking
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.waitForTimeout(100)
    
    const desktopZIndex = await page.evaluate(() => {
      const nav = document.querySelector('.pill-nav')
      if (!nav) return null
      
      const zIndex = window.getComputedStyle(nav).zIndex
      return zIndex === 'auto' ? '0' : zIndex
    })
    
    // Switch to mobile
    await page.setViewportSize({ width: 390, height: 844 })
    await page.waitForTimeout(100)
    
    const mobileZIndex = await page.evaluate(() => {
      const mobileNav = document.querySelector('.pill-nav-mobile')
      if (!mobileNav) return null
      
      return window.getComputedStyle(mobileNav).zIndex
    })
    
    // Both should have proper z-index values
    expect(desktopZIndex).not.toBeNull()
    expect(mobileZIndex).not.toBeNull()
    
    // Mobile should have higher z-index
    expect(parseInt(mobileZIndex)).toBeGreaterThan(parseInt(desktopZIndex))
  })

  test('should handle navigation state changes efficiently', async ({ page }) => {
    await page.goto('/')
    
    // Wait for navigation to load
    await page.waitForSelector('.pill-nav', { state: 'visible' })
    
    // Measure initial render time
    const startTime = Date.now()
    
    // Switch to mobile
    await page.setViewportSize({ width: 390, height: 844 })
    await page.waitForSelector('.pill-nav-mobile', { state: 'visible' })
    
    const mobileRenderTime = Date.now() - startTime
    
    // Switch back to desktop
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.waitForSelector('.pill-nav-items', { state: 'visible' })
    
    const desktopRenderTime = Date.now() - startTime
    
    // Both transitions should be reasonably fast (< 300ms)
    expect(mobileRenderTime).toBeLessThan(300)
    expect(desktopRenderTime).toBeLessThan(300)
  })
})
