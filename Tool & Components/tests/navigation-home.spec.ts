import { test, expect } from '@playwright/test'

test('Pill nav opens on / (home)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const hamburger = page.locator('button.pill-hamburger')
  await expect(hamburger).toBeVisible()
  await hamburger.click()
  await expect(page.locator('.pill-mobile-menu')).toBeVisible()
})


