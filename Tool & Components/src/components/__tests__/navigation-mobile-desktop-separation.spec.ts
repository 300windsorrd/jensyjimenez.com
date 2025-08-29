import { test, expect } from '@playwright/test'

test.describe('Navigation Mobile/Desktop Separation', () => {
  test.describe('Desktop Viewport (1200x800)', () => {
    test('should only show desktop navigation elements', async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 })
      await page.goto('/')

      // Desktop navigation should be visible
      await expect(page.locator('.pill-nav-items')).toBeVisible()
      await expect(page.locator('.pill-logo')).toBeVisible()
      
      // Mobile navigation should be hidden
      await expect(page.locator('.pill-nav-mobile')).not.toBeVisible()
      await expect(page.locator('.pill-hamburger')).not.toBeVisible()
    })

    test('should not show mobile menu even if hamburger is clicked', async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 })
      await page.goto('/')

      // Try to find mobile elements (should not exist)
      const mobileNav = page.locator('.pill-nav-mobile')
      const hamburger = page.locator('.pill-hamburger')
      
      // These should not be in the DOM at all on desktop
      await expect(mobileNav).toHaveCount(0)
      await expect(hamburger).toHaveCount(0)
    })

    test('should have proper z-index hierarchy', async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 })
      await page.goto('/')

      // Check that desktop navigation has appropriate z-index
      const desktopNav = page.locator('.pill-nav')
      const computedStyle = await desktopNav.evaluate((el) => {
        const zIndex = window.getComputedStyle(el).zIndex
        return zIndex === 'auto' ? '0' : zIndex
      })
      
      // Desktop nav should have a reasonable z-index
      expect(parseInt(computedStyle)).toBeGreaterThanOrEqual(0)
    })
  })

  test.describe('Mobile Viewport (390x844)', () => {
    test('should only show mobile navigation elements', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto('/')

      // Mobile navigation should be visible
      await expect(page.locator('.pill-nav-mobile')).toBeVisible()
      await expect(page.locator('.pill-hamburger')).toBeVisible()
      
      // Desktop navigation should be hidden
      await expect(page.locator('.pill-nav-items')).not.toBeVisible()
      await expect(page.locator('.pill-logo')).not.toBeVisible()
    })

    test('should have mobile navigation with proper z-index', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto('/')

      const mobileNav = page.locator('.pill-nav-mobile')
      const computedStyle = await mobileNav.evaluate((el) => {
        return window.getComputedStyle(el).zIndex
      })
      
      // Mobile nav should have high z-index (200001)
      expect(computedStyle).toBe('200001')
    })

    test('should open and close mobile menu properly', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto('/')

      const hamburger = page.locator('.pill-hamburger')
      await expect(hamburger).toBeVisible()
      await expect(hamburger).toHaveAttribute('aria-expanded', 'false')

      // Open menu
      await hamburger.click()
      await expect(hamburger).toHaveAttribute('aria-expanded', 'true')
      
      const mobileMenu = page.locator('.pill-mobile-menu')
      await expect(mobileMenu).toBeVisible()
      await expect(mobileMenu).toHaveAttribute('aria-hidden', 'false')

      // Close menu
      await hamburger.click()
      await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
      await expect(mobileMenu).toHaveAttribute('aria-hidden', 'true')
    })

    test('should close mobile menu when background customization is clicked', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto('/')

      const hamburger = page.locator('.pill-hamburger')
      await expect(hamburger).toBeVisible()

      // Open menu
      await hamburger.click()
      await expect(hamburger).toHaveAttribute('aria-expanded', 'true')
      
      const mobileMenu = page.locator('.pill-mobile-menu')
      await expect(mobileMenu).toBeVisible()

      // Click on background customization element (should close menu)
      const backgroundButton = page.locator('[data-background-customization="true"]').first()
      await backgroundButton.click()
      
      // Menu should be closed
      await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
      await expect(mobileMenu).toHaveAttribute('aria-hidden', 'true')
    })

    test('should not require double-click after background customization interaction', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto('/')

      const hamburger = page.locator('.pill-hamburger')
      await expect(hamburger).toBeVisible()

      // Open menu
      await hamburger.click()
      await expect(hamburger).toHaveAttribute('aria-expanded', 'true')
      
      const mobileMenu = page.locator('.pill-mobile-menu')
      await expect(mobileMenu).toBeVisible()

      // Click on background customization element to close menu
      const backgroundButton = page.locator('[data-background-customization="true"]').first()
      await backgroundButton.click()
      
      // Menu should be closed
      await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
      await expect(mobileMenu).toHaveAttribute('aria-hidden', 'true')

      // Now try to open menu again - should work with single click
      await hamburger.click()
      await expect(hamburger).toHaveAttribute('aria-expanded', 'true')
      await expect(mobileMenu).toBeVisible()
    })

    test('should not have desktop navigation elements in DOM', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto('/')

      // These elements should not exist in the DOM on mobile
      await expect(page.locator('.pill-nav-items')).toHaveCount(0)
      await expect(page.locator('.pill-logo')).toHaveCount(0)
    })
  })

  test.describe('Responsive Behavior', () => {
    test('should switch between mobile and desktop navigation on resize', async ({ page }) => {
      await page.goto('/')

      // Start with desktop view
      await page.setViewportSize({ width: 1200, height: 800 })
      await expect(page.locator('.pill-nav-items')).toBeVisible()
      await expect(page.locator('.pill-logo')).toBeVisible()
      await expect(page.locator('.pill-nav-mobile')).not.toBeVisible()

      // Resize to mobile
      await page.setViewportSize({ width: 390, height: 844 })
      
      // Wait for resize event to be processed
      await page.waitForTimeout(100)
      
      await expect(page.locator('.pill-nav-mobile')).toBeVisible()
      await expect(page.locator('.pill-hamburger')).toBeVisible()
      await expect(page.locator('.pill-nav-items')).not.toBeVisible()
      await expect(page.locator('.pill-logo')).not.toBeVisible()

      // Resize back to desktop
      await page.setViewportSize({ width: 1200, height: 800 })
      
      // Wait for resize event to be processed
      await page.waitForTimeout(100)
      
      await expect(page.locator('.pill-nav-items')).toBeVisible()
      await expect(page.locator('.pill-logo')).toBeVisible()
      await expect(page.locator('.pill-nav-mobile')).not.toBeVisible()
    })

    test('should maintain proper z-index during transitions', async ({ page }) => {
      await page.goto('/')

      // Check desktop z-index
      await page.setViewportSize({ width: 1200, height: 800 })
      await page.waitForTimeout(100)
      
      const desktopNav = page.locator('.pill-nav')
      let desktopZIndex = await desktopNav.evaluate((el) => {
        const zIndex = window.getComputedStyle(el).zIndex
        return zIndex === 'auto' ? '0' : zIndex
      })

      // Check mobile z-index
      await page.setViewportSize({ width: 390, height: 844 })
      await page.waitForTimeout(100)
      
      const mobileNav = page.locator('.pill-nav-mobile')
      let mobileZIndex = await mobileNav.evaluate((el) => {
        return window.getComputedStyle(el).zIndex
      })

      // Both should have proper z-index values
      expect(desktopZIndex).not.toBeNull()
      expect(mobileZIndex).not.toBeNull()
      
      // Mobile should have higher z-index
      expect(parseInt(mobileZIndex)).toBeGreaterThan(parseInt(desktopZIndex))
    })
  })

  test.describe('Edge Cases', () => {
    test('should handle rapid viewport changes gracefully', async ({ page }) => {
      await page.goto('/')

      // Rapidly change viewport sizes
      for (let i = 0; i < 5; i++) {
        await page.setViewportSize({ width: 1200, height: 800 })
        await page.waitForTimeout(50)
        await page.setViewportSize({ width: 390, height: 844 })
        await page.waitForTimeout(50)
      }

      // Final state should be consistent
      await page.setViewportSize({ width: 390, height: 844 })
      await page.waitForTimeout(100)
      
      await expect(page.locator('.pill-nav-mobile')).toBeVisible()
      await expect(page.locator('.pill-nav-items')).not.toBeVisible()
    })

    test('should not have overlapping navigation elements', async ({ page }) => {
      await page.goto('/')

      // Test at breakpoint edge
      await page.setViewportSize({ width: 768, height: 600 })
      await page.waitForTimeout(100)

      // Should show mobile navigation at breakpoint
      await expect(page.locator('.pill-nav-mobile')).toBeVisible()
      await expect(page.locator('.pill-nav-items')).not.toBeVisible()

      // Test just above breakpoint
      await page.setViewportSize({ width: 769, height: 600 })
      await page.waitForTimeout(100)

      // Should show desktop navigation above breakpoint
      await expect(page.locator('.pill-nav-items')).toBeVisible()
      await expect(page.locator('.pill-nav-mobile')).not.toBeVisible()
    })
  })
})
