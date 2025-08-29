import { createClient } from '@supabase/supabase-js'
import { IntakeFormData, Business } from './schema'
import { IntakePayload } from './intake.schema'
import type { SimpleIntake } from './simple-intake.schema'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, '')
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

// Only create client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

function normalizeUrlOrUndefined(input?: string): string | undefined {
  if (!input) return undefined
  try {
    // If missing scheme, assume https
    const withScheme = /^https?:\/\//i.test(input) ? input : `https://${input}`
    const url = new URL(withScheme)
    return url.toString()
  } catch {
    return undefined
  }
}

function composeAddress(intake: IntakeFormData): string {
  const addr = intake.business.address
  const parts = [
    addr?.streetAddress,
    addr?.city,
    addr?.state,
    addr?.zipCode,
    addr?.country
  ].filter(Boolean)
  return parts.join(', ')
}

export function buildIntakePayload(intake: IntakeFormData, turnstileToken: string): IntakePayload {
  const goalMapping: Record<string, 'Calls' | 'Bookings' | 'Orders' | 'Lead Form' | 'Not Sure'> = {
    calls: 'Calls',
    bookings: 'Bookings',
    orders: 'Orders',
    lead_form: 'Lead Form',
    not_sure: 'Not Sure'
  }

  const featureMapping: Record<string, string> = {
    booking: 'Booking',
    menu_catalog: 'Menu Catalog',
    gift_cards: 'Gift Cards',
    testimonials: 'Testimonials',
    gallery: 'Gallery',
    blog: 'Blog',
    faq: 'FAQ',
    map: 'Map',
    hours: 'Hours',
    contact_form: 'Contact Form',
    chat: 'Chat',
    analytics: 'Analytics',
    not_sure: 'Not Sure'
  }

  const selectedDomain = normalizeUrlOrUndefined(intake.business.domain)
  const address = composeAddress(intake)

  const mappedPages = (intake.goals.pages || []).filter((p) => p !== 'not_sure')
  const pages = mappedPages.length ? (mappedPages as IntakePayload['pages']) : (['Home'] as IntakePayload['pages'])

  // Normalize template labels to match backend variants
  const normalizeTemplate = (t: string): 'Template A' | 'Template B' | 'Style A' | 'Style B' => {
    if (t === 'Style A' || t === 'Template A') return (process.env.NEXT_PUBLIC_TEMPLATE_LABEL || 'Template') === 'Template' ? 'Template A' : 'Style A'
    if (t === 'Style B' || t === 'Template B') return (process.env.NEXT_PUBLIC_TEMPLATE_LABEL || 'Template') === 'Template' ? 'Template B' : 'Style B'
    return 'Template A'
  }

  return {
    business_name: intake.business.name || 'Test Business',
    industry: intake.business.industry || 'Technology',
    address: address || '123 Test Street',
    phone: intake.business.phone || '555-0123',
    domain: selectedDomain,
    goals: (() => {
      const mapped = (intake.goals.conversions || [])
        .map((g) => goalMapping[g])
        .filter((g): g is NonNullable<typeof g> => Boolean(g))
      return mapped.length ? mapped : (['Not Sure'] as any)
    })(),
    pages,
    color: {
      selected: intake.color.brand || '#000000',
      mode: (() => {
        const map: Record<string, IntakePayload['color']['mode']> = {
          'complementary': 'Complementary',
          'analogous': 'Analogous',
          'split': 'Split',
          'triad': 'Triad',
          'tetrad': 'Tetrad',
          'mono': 'Monochrome',
          'mono-tints': 'Monochrome Tints'
        }
        const h = (intake as any)?.color?.harmony as keyof typeof map | undefined
        return (h && map[h]) || 'Monochrome'
      })(),
      palette: intake.color.palette || ['#000000']
    },
    typography: {
      headings: intake.fonts.headings || 'inter',
      body: intake.fonts.body || 'inter',
      style: intake.fonts.headings || 'inter'
    },
    templates: ((intake.templates?.length ? intake.templates : ['Style A']).map(normalizeTemplate)) as IntakePayload['templates'],
    inspiration_urls: intake.referenceUrls || [],
    features: (intake.features || [])
      .map((f) => featureMapping[f])
      .filter((f): f is NonNullable<typeof f> => Boolean(f)) as unknown as IntakePayload['features'],
    timeline:
      intake.admin?.timeline?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || '3-4 weeks',
    plan: intake.admin?.plan
      ? intake.admin.plan.charAt(0).toUpperCase() + intake.admin.plan.slice(1)
      : 'Standard',
    organization: {
      name: intake.business.name || 'Test Business',
      website: selectedDomain,
      phone: intake.business.phone || '555-0123',
      address,
      domain: selectedDomain
    },
    turnstileToken
  }
}

export async function submitIntake(intake: IntakeFormData, turnstileToken: string): Promise<{ success: boolean; id?: string; error?: string }> {
  // On the client, proxy through our own API to avoid CORS/network issues
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turnstileToken, ...intake })
      })
      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit intake')
      }
      return { success: true, id: result.id }
    } catch (error) {
      console.error('Error submitting intake (client):', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  if (!supabase) {
    return { 
      success: false, 
      error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.' 
    }
  }

  try {
    const edgeFunctionPayload: IntakePayload = buildIntakePayload(intake, turnstileToken)
    
    // Submit to Edge Function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, '');
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    const response = await fetch(`${supabaseUrl}/functions/v1/intake-submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify(edgeFunctionPayload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit intake');
    }

    return { success: true, id: result.intakeId };
  } catch (error) {
    console.error('Error submitting intake:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

export function buildSimpleIntakePayload(intake: SimpleIntake) {
	const mapRole = (r: SimpleIntake['role']) => ({ 
		owner: 'Owner', 
		manager: 'Manager', 
		employee: 'Employee', 
		investor: 'Investor', 
		other: 'Other' 
	}[r])
	const mapUrgency = (u: SimpleIntake['urgency']) => (u === 'soon' ? 'Soon' : 'No Rush')
	return {
		name: intake.name,
		company: intake.company,
		role: mapRole(intake.role),
		email: intake.email,
		phone: intake.phone,
		urgency: mapUrgency(intake.urgency),
		turnstileToken: intake.turnstileToken
	}
}

export async function submitSimpleIntake(intake: SimpleIntake, turnstileToken: string): Promise<{ success: boolean; id?: string; error?: string }> {
	// Call our Next.js API route instead of Supabase Edge Function
	try {
		const response = await fetch('/api/lead', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...intake, turnstileToken })
		})
		
		const result = await response.json()
		if (!response.ok || !result.success) {
			throw new Error(result.error || 'Failed to submit lead')
		}
		
		return { success: true, id: result.id }
	} catch (error: unknown) {
		console.error('Error submitting simple intake:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		}
	}
}

export async function getIntake(id: string): Promise<{ success: boolean; data?: Business; error?: string }> {
  if (!supabase) {
    return { 
      success: false, 
      error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.' 
    }
  }

  try {
    const { data, error } = await supabase
      .from('intakes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return { success: true, data: data as Business }
  } catch (error) {
    console.error('Error fetching intake:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

export async function getAllIntakes(): Promise<{ success: boolean; data?: Business[]; error?: string }> {
  if (!supabase) {
    return { 
      success: false, 
      error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.' 
    }
  }

  try {
    const { data, error } = await supabase
      .from('intakes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: data as Business[] }
  } catch (error) {
    console.error('Error fetching intakes:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

// Captcha-gated authentication functions
export async function authGate(email: string, password: string, mode: 'signin' | 'signup', turnstileToken: string): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/auth-gate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ email, password, mode, turnstileToken })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Authentication gate failed');
    }

    return { success: true, userId: result.userId };
  } catch (error) {
    console.error('Error in auth gate:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

export async function signInWithCaptcha(email: string, password: string, turnstileToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    // First verify captcha through auth gate
    const gateResult = await authGate(email, password, 'signin', turnstileToken);
    if (!gateResult.success) {
      return gateResult;
    }

    // If captcha passes, proceed with normal sign in
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error signing in with captcha:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}
