import { test, expect } from '@playwright/test'

test.describe('Navigation Accessibility', () => {
  test.describe('Desktop Navigation', () => {
    test('should have proper ARIA labels and roles', async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 })
      await page.goto('/')
      
      // Main navigation should have proper role
      const nav = page.locator('.pill-nav')
      await expect(nav).toHaveAttribute('aria-label', 'Primary navigation')
      
      // Navigation items should have proper roles
      const navItems = page.locator('.pill-list')
      await expect(navItems).toHaveAttribute('role', 'menubar')
      
      // Individual items should have proper roles
      const pills = page.locator('.pill')
      await expect(pills.first()).toHaveAttribute('role', 'menuitem')
    })

    test('should support keyboard navigation', async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 })
      await page.goto('/')
      
      // Focus should be visible
      await page.keyboard.press('Tab')
      
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
      
      // Should be able to navigate with arrow keys
      await page.keyboard.press('ArrowRight')
      
      // Focus should move to next item
      const nextFocused = page.locator(':focus')
      await expect(nextFocused).toBeVisible()
    })

    test('should have proper focus management', async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 })
      await page.goto('/')
      
      // Logo should be focusable
      const logo = page.locator('.pill-logo')
      await logo.focus()
      await expect(logo).toBeFocused()
      
      // Logo should have proper aria-label
      await expect(logo).toHaveAttribute('aria-label', 'Home - Navigate to homepage')
    })
  })

  test.describe('Mobile Navigation', () => {
    test('should have proper mobile menu accessibility', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto('/')
      
      const hamburger = page.locator('.pill-hamburger')
      await expect(hamburger).toBeVisible()
      
      // Hamburger should have proper ARIA attributes
      await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
      await expect(hamburger).toHaveAttribute('aria-label', 'Open navigation menu')
      
      // Open menu
      await hamburger.click()
      
      // ARIA attributes should update
      await expect(hamburger).toHaveAttribute('aria-expanded', 'true')
      await expect(hamburger).toHaveAttribute('aria-label', 'Close navigation menu')
      
      // Mobile menu should have proper ARIA attributes
      const mobileMenu = page.locator('.pill-mobile-menu')
      await expect(mobileMenu).toHaveAttribute('aria-hidden', 'false')
      
      // Close menu
      await hamburger.click()
      
      // ARIA attributes should update back
      await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
      await expect(hamburger).toHaveAttribute('aria-label', 'Open navigation menu')
      await expect(mobileMenu).toHaveAttribute('aria-hidden', 'true')
    })

    test('should have accessible mobile menu', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto('/')
      
      const hamburger = page.locator('.pill-hamburger')
      await hamburger.click()
      
      // Menu should be open
      const mobileMenu = page.locator('.pill-mobile-menu')
      await expect(mobileMenu).toBeVisible()
      
      // Menu items should be accessible
      const menuItems = page.locator('.pill-mobile-link')
      await expect(menuItems).toHaveCount(4) // Home, About, Pricing, Get Started
      
      // Each item should have proper ARIA attributes
      for (let i = 0; i < 4; i++) {
        const item = menuItems.nth(i)
        await expect(item).toHaveAttribute('aria-label')
      }
    })

    // Click-outside functionality not implemented in current version
  })

  test.describe('Cross-Platform Accessibility', () => {
    test('should maintain accessibility during viewport changes', async ({ page }) => {
      await page.goto('/')
      
      // Start with desktop
      await page.setViewportSize({ width: 1200, height: 800 })
      await page.waitForTimeout(100)
      
      // Check desktop accessibility
      const desktopNav = page.locator('.pill-nav')
      await expect(desktopNav).toHaveAttribute('aria-label', 'Primary navigation')
      
      // Switch to mobile
      await page.setViewportSize({ width: 390, height: 844 })
      await page.waitForTimeout(100)
      
      // Check mobile accessibility
      const hamburger = page.locator('.pill-hamburger')
      await expect(hamburger).toBeVisible()
      await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
      
      // Switch back to desktop
      await page.setViewportSize({ width: 1200, height: 800 })
      await page.waitForTimeout(100)
      
      // Desktop accessibility should be restored
      await expect(desktopNav).toHaveAttribute('aria-label', 'Primary navigation')
    })

    test('should have consistent focus indicators', async ({ page }) => {
      await page.goto('/')
      
      // Test desktop focus
      await page.setViewportSize({ width: 1200, height: 800 })
      await page.waitForTimeout(100)
      
      await page.keyboard.press('Tab')
      const desktopFocused = page.locator(':focus')
      await expect(desktopFocused).toBeVisible()
      
      // Test mobile focus
      await page.setViewportSize({ width: 390, height: 844 })
      await page.waitForTimeout(100)
      
      await page.keyboard.press('Tab')
      const mobileFocused = page.locator(':focus')
      await expect(mobileFocused).toBeVisible()
    })

    test('should announce navigation state changes to screen readers', async ({ page }) => {
      await page.goto('/')
      
      // Test mobile menu state announcements
      await page.setViewportSize({ width: 390, height: 844 })
      await page.waitForTimeout(100)
      
      const hamburger = page.locator('.pill-hamburger')
      
      // Initial state
      await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
      
      // Open menu
      await hamburger.click()
      await expect(hamburger).toHaveAttribute('aria-expanded', 'true')
      
      // Close menu
      await hamburger.click()
      await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
    })
  })

  test.describe('Screen Reader Support', () => {
    // Removed heading structure test as it's not navigation-specific

    test('should have proper landmark regions', async ({ page }) => {
      await page.goto('/')
      
      // Main navigation should be in a nav landmark
      const primaryNav = page.locator('nav[aria-label="Primary navigation"]')
      await expect(primaryNav).toBeVisible()
      
      // Should have main content area
      const main = page.locator('main')
      await expect(main).toBeVisible()
    })
  })

  test.describe('Sticky Navigation', () => {
    test('should be sticky on all pages', async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 })
      
      // Test on home page
      await page.goto('/')
      const navContainer = page.locator('.pill-nav-container')
      await expect(navContainer).toHaveCSS('position', 'fixed')
      
      // Test on about page
      await page.goto('/about')
      await expect(navContainer).toHaveCSS('position', 'fixed')
      
      // Test on pricing page
      await page.goto('/pricing')
      await expect(navContainer).toHaveCSS('position', 'fixed')
      
      // Test on start page (should also be sticky)
      await page.goto('/start')
      await expect(navContainer).toHaveCSS('position', 'fixed')
    })

    test('should maintain sticky behavior on scroll', async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 })
      await page.goto('/')
      
      const navContainer = page.locator('.pill-nav-container')
      
      // Check initial position
      const initialTop = await navContainer.evaluate(el => el.getBoundingClientRect().top)
      
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500))
      
      // Navigation should still be in the same position (sticky)
      const scrolledTop = await navContainer.evaluate(el => el.getBoundingClientRect().top)
      expect(scrolledTop).toBe(initialTop)
    })

    test('should have proper body padding for fixed navigation', async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 })
      await page.goto('/')
      
      // Body should have padding-top to prevent content overlap
      const body = page.locator('body')
      await expect(body).toHaveCSS('padding-top', '80px')
    })
  })

  test.describe('Mobile Sticky Navigation', () => {
    test('should be sticky on mobile for all pages', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      
      // Test on home page
      await page.goto('/')
      const navContainer = page.locator('.pill-nav-container')
      await expect(navContainer).toHaveCSS('position', 'fixed')
      
      // Test on start page (should also be sticky)
      await page.goto('/start')
      await expect(navContainer).toHaveCSS('position', 'fixed')
    })

    test('should maintain mobile navigation accessibility on scroll', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto('/')
      
      const navContainer = page.locator('.pill-nav-container')
      const hamburger = page.locator('.pill-hamburger')
      
      // Check initial position
      const initialTop = await navContainer.evaluate(el => el.getBoundingClientRect().top)
      
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 300))
      
      // Navigation should still be in the same position (sticky)
      const scrolledTop = await navContainer.evaluate(el => el.getBoundingClientRect().top)
      expect(scrolledTop).toBe(initialTop)
      
      // Hamburger button should still be clickable
      await expect(hamburger).toBeVisible()
      await expect(hamburger).toBeEnabled()
    })
  })
})
