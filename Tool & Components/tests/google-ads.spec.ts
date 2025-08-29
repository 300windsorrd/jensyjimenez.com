import { test, expect } from '@playwright/test'

test('Google Ads page renders with heading and pricing', async ({ page }) => {
	await page.goto('/google-ads')
	await expect(page.getByRole('heading', { name: 'Google Ads Management for Small Businesses' })).toBeVisible()
	await expect(page.locator('text=Management fee: 10% of monthly ad spend.').first()).toBeVisible()
})


