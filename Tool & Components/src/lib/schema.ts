import { z } from 'zod'

export const intakeSchema = z.object({
  business: z.object({
    name: z.string().min(1, 'Business name is required'),
    industry: z.string().min(1, 'Industry is required'),
    address: z.object({
      country: z.string().min(1, 'Country is required'),
      state: z.string().optional(), // Only required for US
                 streetAddress: z.string().min(1, 'Street address is required'),
      city: z.string().min(1, 'City is required'),
      zipCode: z.string().min(1, 'ZIP/Postal code is required'),
    }),
    phone: z.string()
      .min(1, 'Phone number is required')
      .min(10, 'Phone number must be at least 10 digits')
      .regex(/^[\d\s\(\)\-\+\.\-]+$/, 'Please enter a valid phone number'),
    domain: z.string().optional(), // Completely optional, no validation
    socials: z.object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
    }).optional(),
  }),
  goals: z.object({
    conversions: z.array(z.enum(['calls', 'bookings', 'orders', 'lead_form', 'not_sure'])).min(1, 'Please select at least one conversion goal'),
    pages: z.array(z.enum(['Home', 'About', 'Services', 'Contact', 'Blog', 'Menu', 'Products', 'not_sure'])).min(1, 'Please select at least one page type'),
  }),
  referenceUrls: z.array(z.string().url('Please enter a valid URL')).max(2, 'Maximum 2 reference URLs allowed').optional(),
  color: z.object({
    brand: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please select a valid color'),
    // Harmony used by ColorWheel; separate from UI color mode
    harmony: z.enum(['complementary','analogous','split','triad','tetrad','mono','mono-tints']).default('tetrad'),
    palette: z.array(z.string().regex(/^#[0-9A-F]{6}$/i, 'Please select valid colors')).min(1, 'Please select at least one color'),
  }),
  fonts: z.object({
    headings: z.enum([
      // Categories (back-compat)
      'modern', 'classic_serif', 'geometric_sans', 'playful',
      // Specific families
      'inter', 'poppins', 'montserrat', 'raleway', 'nunito', 'lato', 'quicksand',
      'playfair_display', 'merriweather', 'lora', 'roboto_slab', 'comic_neue'
    ]).default('modern'),
    body: z.enum([
      // Categories (back-compat)
      'modern', 'classic_serif', 'geometric_sans', 'playful',
      // Specific families
      'inter', 'poppins', 'montserrat', 'raleway', 'nunito', 'lato', 'quicksand',
      'playfair_display', 'merriweather', 'lora', 'roboto_slab', 'comic_neue'
    ]).default('modern'),
  }),
  templates: z.array(z.enum(['Style A', 'Style B'])).min(1, 'Please select at least one design style').max(2, 'Maximum 2 design styles allowed'),
  features: z.array(z.enum([
    'booking', 'menu_catalog', 'gift_cards', 'testimonials', 'gallery', 
    'blog', 'faq', 'map', 'hours', 'contact_form', 'chat', 'analytics', 'not_sure'
  ])).optional(),
  assets: z.object({
    logoUrl: z.string().url('Please enter a valid URL').optional(),
  }).optional(),
  content: z.object({
    tagline: z.string().optional(),
    about: z.string().optional(),
  }).optional(),
  admin: z.object({
    timeline: z.enum(['1-2_weeks', '3-4_weeks', '1-2_months', '3+_months']).default('3-4_weeks'),
    plan: z.enum(['basic', 'standard', 'premium']).default('standard'),
    launchWindow: z.string().optional(),
  }).optional(),
})

export type IntakeFormData = z.infer<typeof intakeSchema>

export const businessSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  ...intakeSchema.shape,
})

export type Business = z.infer<typeof businessSchema>
