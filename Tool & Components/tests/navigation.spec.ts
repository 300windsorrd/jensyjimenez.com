import { test, expect } from '@playwright/test'

test.describe('Pill Navigation - mobile hamburger', () => {
  test('opens and closes mobile menu on hamburger click', async ({ page, context }) => {
    await context.grantPermissions([])
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const hamburger = page.locator('button.pill-hamburger')
    await expect(hamburger).toBeVisible()
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false')

    await hamburger.click()
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true')

    // Menu is rendered in a portal to body and toggles aria-hidden=false
    const menu = page.locator('.pill-mobile-menu')
    await expect(menu).toBeVisible()
    await expect(menu).toHaveAttribute('aria-hidden', 'false')

    // Close
    await hamburger.click()
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
  })
})


