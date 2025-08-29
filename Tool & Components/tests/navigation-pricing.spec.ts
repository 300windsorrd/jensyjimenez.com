import { test, expect } from '@playwright/test'

test('Pill nav opens on /pricing as well', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/pricing')
  const hamburger = page.locator('button.pill-hamburger')
  await expect(hamburger).toBeVisible()
  await hamburger.click()
  await expect(hamburger).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('.pill-mobile-menu')).toBeVisible()
})


