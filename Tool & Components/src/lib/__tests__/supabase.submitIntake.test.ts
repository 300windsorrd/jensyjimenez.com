import { submitIntake, buildIntakePayload } from '@/lib/supabase'
import { IntakeFormData } from '@/lib/schema'

describe('submitIntake', () => {
  const originalEnv = process.env
  const baseForm: IntakeFormData = {
    business: {
      name: 'Acme Co',
      industry: 'Retail & E-commerce',
      address: {
        country: 'United States',
        state: 'CA',
        streetAddress: '1 Main St',
        city: 'San Francisco',
        zipCode: '94105'
      },
      phone: '555-123-4567',
      domain: 'acme.com',
      socials: {}
    },
    goals: {
      conversions: ['calls'],
      pages: ['Home']
    },
    color: {
      brand: '#3366FF',
      mode: 'auto',
      palette: ['#3366FF']
    },
    fonts: {
      headings: 'inter',
      body: 'inter'
    },
    templates: ['Style A'],
    referenceUrls: [],
    features: [],
    assets: {},
    content: {},
    admin: { timeline: '3-4_weeks', plan: 'standard' }
  }

  beforeEach(() => {
    jest.resetAllMocks()
    process.env = { ...originalEnv }
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('calls edge function and returns intake id', async () => {
    const mockId = '1234-uuid'
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, intakeId: mockId })
    } as any)

    const res = await submitIntake(baseForm, 'tok')
    expect(res).toEqual({ success: true, id: mockId })
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.supabase.co/functions/v1/intake-submit',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('returns error on non-200', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'bad' })
    } as any)
    const res = await submitIntake(baseForm, 'tok')
    expect(res.success).toBe(false)
    expect(res.error).toBe('bad')
  })
})


