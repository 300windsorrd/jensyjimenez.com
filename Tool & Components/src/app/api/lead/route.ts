import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { simpleIntakeSchema } from '@/lib/simple-intake.schema'

// Required for Cloudflare Pages deployment
export const runtime = 'edge'

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Only create client if environment variables are available
const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Extract turnstile token from request body
    let { turnstileToken, ...intakeData } = body
    
    // Dev fallback: allow missing token in non-production
    if (!turnstileToken && process.env.NODE_ENV !== 'production') {
      turnstileToken = 'placeholder-token'
    } else if (!turnstileToken) {
      return NextResponse.json(
        { success: false, error: 'Turnstile token is required' },
        { status: 400 }
      )
    }
    
    // Validate the intake data
    const validatedData = simpleIntakeSchema.parse({ ...intakeData, turnstileToken })
    
    // Transform the data to match the database schema
    const leadData = {
      name: validatedData.name,
      company: validatedData.company,
      role: validatedData.role.charAt(0).toUpperCase() + validatedData.role.slice(1), // Capitalize first letter
      email: validatedData.email,
      phone: validatedData.phone,
      urgency: validatedData.urgency === 'soon' ? 'Soon' : 'No Rush'
    }
    
    // Check if Supabase is configured
    if (!supabase) {
      console.error('Supabase not configured. Missing environment variables.')
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      )
    }

    // Insert into database
    console.log('Attempting to insert lead data:', leadData)
    const { data, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select('id')
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        success: true, 
        id: data.id,
        message: 'Lead submitted successfully' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Lead submission error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.message 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
