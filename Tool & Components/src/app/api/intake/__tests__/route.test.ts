jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body
    })
  }
}))

import { POST } from '@/app/api/intake/route'

describe('api/intake POST', () => {
  const originalEnv = process.env
  beforeEach(() => {
    process.env = { ...originalEnv }
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, intakeId: 'id-1' })
    } as any)
  })
  afterAll(() => { process.env = originalEnv })

  it('validates turnstile token presence', async () => {
    const req = { json: async () => ({}) }
    const res = await POST(req as any)
    const json = await (res as any).json()
    expect((res as any).status).toBe(400)
    expect(json.error).toBe('Turnstile token is required')
  })

  it('submits valid payload', async () => {
    const req = { json: async () => ({
        turnstileToken: 'tok',
        business: {
          name: 'Acme',
          industry: 'Retail',
          address: { country: 'US', state: 'CA', streetAddress: '1 Main', city: 'SF', zipCode: '94105' },
          phone: '5551234567',
          domain: 'acme.com',
          socials: {}
        },
        goals: { conversions: ['calls'], pages: ['Home'] },
        color: { brand: '#000000', mode: 'auto', palette: ['#000000'] },
        fonts: { headings: 'inter', body: 'inter' },
        templates: ['Style A']
      }) }
    const res = await POST(req as any)
    const json = await (res as any).json()
    expect((res as any).status).toBe(201)
    expect(json.success).toBe(true)
    expect(json.id).toBe('id-1')
  })
})


