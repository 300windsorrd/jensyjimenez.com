import { test, expect } from '@playwright/test'

test.describe.skip('Intake E2E (legacy multi-step)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/functions/v1/intake-submit', async (route) => {
      const req = route.request()
      const method = req.method()
      const body = method === 'POST' ? await req.postDataJSON().catch(() => ({})) : {}
      return route.fulfill({ status: 201, body: JSON.stringify({ success: true, id: 'e2e-intake-id' }) })
    })
  })

  test('submits multi-step form', async ({ page }) => {
    await page.goto('/start')
    await expect(page.getByRole('heading', { name: /start a project/i })).toBeVisible()

    // Step 1: Business Info
    await page.getByPlaceholder('Your Business Name').fill('Acme Co')
    await page.locator('label:has-text("Industry *") + div select').selectOption({ label: 'Retail & E-commerce' })
    await page.locator('label:has-text("Country *") + div select').selectOption({ label: 'Canada' })
    await page.getByPlaceholder('123 Main Street').fill('1 Main St')
    await page.getByPlaceholder('City Name').fill('Toronto')
    await page.getByPlaceholder('12345 or A1B 2C3').fill('M5H 2N2')
    await page.getByPlaceholder('(555) 123-4567').fill('5551234567')
    await page.getByRole('button', { name: /^Next$/ }).click()

    // Step 2: Goals & Pages
    await page.getByText('Phone Calls').click()
    await page.getByText('Lead Capture').click()
    await page.getByText('Home').click()
    await page.getByText('About').click()
    await page.getByRole('button', { name: /^Next$/ }).click()

    // Step 3
    await page.getByRole('button', { name: /^Next$/ }).click()

    // Step 4
    await page.getByText('Style A').first().click()
    await page.getByRole('button', { name: /^Next$/ }).click()

    // Step 5 (optional)
    await page.getByRole('button', { name: /^Next$/ }).click()

    // Step 6: Submit
    await page.addInitScript(() => {
      // @ts-ignore
      window.turnstile = { getResponse: () => 'e2e-mock-token' }
    })
    await page.getByRole('button', { name: /submit/i }).click()

    await expect(page.getByText(/Your project has been submitted successfully/i)).toBeVisible()
  })
})


