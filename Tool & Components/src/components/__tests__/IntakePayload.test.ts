import { buildIntakePayload } from '@/lib/supabase'
import { IntakeFormData } from '@/lib/schema'

function baseData(): IntakeFormData {
  return {
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
      conversions: ['calls', 'lead_form'],
      pages: ['Home', 'About', 'not_sure']
    },
    color: {
      brand: '#3366FF',
      mode: 'auto',
      palette: ['#3366FF', '#112233']
    },
    fonts: {
      headings: 'inter',
      body: 'inter'
    },
    templates: ['Style A'],
    referenceUrls: ['https://example.com'],
    features: ['booking', 'analytics', 'not_sure' as any],
    assets: {},
    content: {},
    admin: {
      timeline: '3-4_weeks',
      plan: 'standard'
    }
  }
}

describe('buildIntakePayload', () => {
  it('maps fields and filters not_sure correctly', () => {
    const form = baseData()
    const payload = buildIntakePayload(form, 'tok')
    expect(payload.business_name).toBe('Acme Co')
    expect(payload.goals).toEqual(['Calls', 'Lead Form'])
    expect(payload.pages).toEqual(['Home', 'About'])
    expect(payload.features).toEqual(['Booking', 'Analytics'])
    expect(payload.domain).toBe('https://acme.com/')
    expect(payload.organization.website).toBe('https://acme.com/')
    expect(payload.address).toContain('San Francisco')
    expect(payload.color.mode).toBe('Monochrome')
    expect(payload.plan).toBe('Standard')
    expect(payload.timeline).toBe('3-4 Weeks')
  })

  it('handles missing optionals gracefully', () => {
    const form = baseData()
    form.business.domain = ''
    form.referenceUrls = []
    form.features = []
    const payload = buildIntakePayload(form, 'tok')
    expect(payload.domain).toBeUndefined()
    expect(payload.inspiration_urls).toEqual([])
    expect(payload.features).toEqual([])
  })
})


