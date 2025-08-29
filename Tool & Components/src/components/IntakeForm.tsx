'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { intakeSchema, IntakeFormData } from '@/lib/schema'
import { z } from 'zod'
import { submitIntake } from '@/lib/supabase'
import dynamic from 'next/dynamic'
import { useBackground } from '@/contexts/BackgroundContext'

// Lazy-load heavier client components to reduce initial JS
const FontVariablesProvider = dynamic(() => import('./FontVariablesProvider'), { ssr: false, loading: () => <></> })
const ColorWheel = dynamic(() => import('./ColorWheel'), { ssr: false })
const TemplatePicker = dynamic(() => import('./TemplatePicker'), { ssr: false })

const steps = [
  { id: 1, title: 'Business Info', description: 'Basic business details' },
  { id: 2, title: 'Goals & Pages', description: 'What you want to achieve' },
  { id: 3, title: 'Style & Colors', description: 'Visual preferences' },
  { id: 4, title: 'Inspiration', description: 'Choose your inspiration' },
  { id: 5, title: 'Features', description: 'Additional functionality' },
  { id: 6, title: 'Review', description: 'Final review & submit' }
]

// Labels for nicer display in summary
const GOAL_LABELS: Record<string, string> = {
  calls: 'Phone Calls',
  bookings: 'Appointments',
  orders: 'Online Orders',
  lead_form: 'Lead Capture'
}

export default function IntakeForm() {
  const { getButtonColor, getButtonTextColor } = useBackground()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean; message: string } | null>(null)
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1)
  const [isStepValid, setIsStepValid] = useState(false)
  const [showValidationWarning, setShowValidationWarning] = useState(false)
  const [customIndustry, setCustomIndustry] = useState('')
  const [customCountry, setCustomCountry] = useState('')
  const [mounted, setMounted] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const [turnstileId, setTurnstileId] = useState<string | null>(null)
  const [captchaVisible, setCaptchaVisible] = useState(false)
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null)
  const tokenRef = useRef<string>('')
  const tokenWaitersRef = useRef<Array<(t: string) => void>>([])

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid, isDirty, touchedFields }
  } = useForm<IntakeFormData>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      business: {
        name: '',
        industry: '',
        address: {
          country: '',
          state: '',
          streetAddress: '',
          city: '',
          zipCode: ''
        },
        phone: '',
        domain: '',
        socials: {}
      },
      goals: {
        conversions: [],
        pages: []
      },
      color: {
        brand: '#3B82F6',
        palette: ['#3B82F6']
      },
      fonts: {
        headings: 'modern',
        body: 'modern'
      },
      templates: [],
      referenceUrls: [],
      features: [],
      assets: {},
      content: {},
      admin: {
        timeline: '3-4_weeks',
        plan: 'standard'
      }
    },
    mode: 'onBlur' // Validate on blur for better UX
  })

  const watchedValues = watch()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent accidental auto-submit when transitioning to step 6
  useEffect(() => {
    if (currentStep === steps.length) {
      setCanSubmit(false)
      const t = setTimeout(() => setCanSubmit(true), 600)
      return () => clearTimeout(t)
    }
    setCanSubmit(false)
  }, [currentStep])

  // Prefetch Turnstile script on the step before submission to hide first-load cost
  useEffect(() => {
    if (!mounted) return
    if (currentStep !== steps.length - 1) return
    if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return
    if (document.querySelector('script[src*="turnstile/v0/api.js"]')) return
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    s.async = true
    s.defer = true
    document.head.appendChild(s)
  }, [mounted, currentStep])

  // Initialize Cloudflare Turnstile only on the final step to avoid unnecessary traffic
  useEffect(() => {
    if (!mounted) return
    if (currentStep !== steps.length) return
    if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return
    // @ts-ignore
    const ts = typeof window !== 'undefined' ? (window as any).turnstile : null
    const container = turnstileContainerRef.current
    if (!container || turnstileId) return
    // Use a valid size; rely on appearance=execute for programmatic execution
    const size = (process.env.NEXT_PUBLIC_TURNSTILE_MODE === 'visible') ? 'normal' : 'normal'

    const renderWhenReady = () => {
      // @ts-ignore
      const api = (window as any).turnstile
      if (!api) {
        // Lazy-load the Turnstile script only when needed
        if (!document.querySelector('script[src*="turnstile/v0/api.js"]')) {
          const s = document.createElement('script')
          s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
          s.async = true
          s.defer = true
          document.head.appendChild(s)
        }
        setTimeout(renderWhenReady, 250)
        return
      }
      try {
        const id = api.render(container, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          size,
          appearance: (process.env.NEXT_PUBLIC_TURNSTILE_MODE === 'visible') ? 'always' : 'execute',
          callback: (token: string) => {
            tokenRef.current = token
            setTurnstileToken(token)
            const waiters = tokenWaitersRef.current
            if (waiters.length) {
              waiters.splice(0).forEach((resolve) => resolve(token))
            }
          },
          'expired-callback': () => {
            tokenRef.current = ''
            setTurnstileToken('')
          },
          'error-callback': () => {
            tokenRef.current = ''
            setTurnstileToken('')
          }
        })
        setTurnstileId(id)
      } catch {
        // ignore
      }
    }
    renderWhenReady()
  }, [mounted, currentStep, turnstileId])

  const ensureTurnstileToken = async (): Promise<string> => {
    // If no site key configured, allow placeholder for local/dev
    if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return 'placeholder-token'
    // @ts-ignore
    const ts = typeof window !== 'undefined' ? (window as any).turnstile : null
    if (!ts || !turnstileId) return ''
    if (tokenRef.current) return tokenRef.current
    try {
      ts.execute(turnstileId)
      return await new Promise<string>((resolve) => {
        const timeout = setTimeout(() => resolve(''), 8000)
        tokenWaitersRef.current.push((t) => {
          clearTimeout(timeout)
          resolve(t)
        })
      })
    } catch {
      return ''
    }
  }

  // Get fields to validate for current step
  const getCurrentStepFields = useCallback((): string[] => {
    switch (currentStep) {
      case 1:
        return ['business.name', 'business.industry', 'business.address.country', 'business.address.streetAddress', 'business.address.city', 'business.address.zipCode', 'business.phone'];
      case 2:
        return ['goals.conversions', 'goals.pages'];
      case 3:
        return ['color.brand', 'fonts.headings', 'fonts.body'];
      case 4:
        return ['templates'];
      case 5:
        return []; // Features are optional
      case 6:
        return []; // All validation done in previous steps
      default:
        return [];
    }
  }, [currentStep]);

  // Function to check if current step is valid
  const isCurrentStepValid = useCallback(async () => {
    try {
      // Custom validation for each step to ensure proper validation
      switch (currentStep) {
        case 1:
          // Business info - validate required fields
          const business = watchedValues.business;
          return !!(
            business?.name?.trim() &&
            business?.industry?.trim() &&
            business?.address?.country?.trim() &&
            business?.address?.streetAddress?.trim() &&
            business?.address?.city?.trim() &&
            business?.address?.zipCode?.trim() &&
            business?.phone?.trim()
          );
        
        case 2:
          // Goals - validate arrays have content
          const conversions = watchedValues.goals?.conversions || [];
          const pages = watchedValues.goals?.pages || [];
          return conversions.length > 0 && pages.length > 0;
        
        case 3:
          // Style & Colors - validate required fields
          const color = watchedValues.color;
          const fonts = watchedValues.fonts;
          return !!(
            color?.brand?.trim() &&
            fonts?.headings?.trim() &&
            fonts?.body?.trim()
          );
        
        case 4:
          // Templates - validate at least one template selected
          const templates = watchedValues.templates || [];
          return templates.length > 0;
        
        case 5:
          // Features are optional, so always valid
          return true;
        
        case 6:
          // Review step - all validation done in previous steps
          return true;
        
        default:
          return true;
      }
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  }, [currentStep, watchedValues]);

  // Validate step whenever watched values change, but debounced
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const isValid = await isCurrentStepValid();
      setIsStepValid(isValid);
    }, 300); // Debounce validation by 300ms

    return () => clearTimeout(timeoutId);
  }, [isCurrentStepValid, currentStep, watchedValues.goals]);

  // Reset validation warning when step changes
  useEffect(() => {
    setShowValidationWarning(false);
  }, [currentStep]);

  // Get data for current step only
  const getCurrentStepData = () => {
    switch (currentStep) {
      case 1:
        return { business: watchedValues.business };
      case 2:
        return { goals: watchedValues.goals };
      case 3:
        return { color: watchedValues.color, fonts: watchedValues.fonts };
      case 4:
        return { templates: watchedValues.templates };
      case 5:
        return { features: watchedValues.features };
      case 6:
        return watchedValues;
      default:
        return null;
    }
  };

  // Get validation schema for current step
  const getStepSchema = (step: number) => {
    switch (step) {
      case 1:
        return z.object({ business: intakeSchema.shape.business });
      case 2:
        return z.object({ goals: intakeSchema.shape.goals });
      case 3:
        return z.object({ 
          color: intakeSchema.shape.color, 
          fonts: intakeSchema.shape.fonts 
        });
      case 4:
        return z.object({ templates: intakeSchema.shape.templates });
      case 5:
        return z.object({ features: intakeSchema.shape.features });
      case 6:
        return intakeSchema;
      default:
        return z.object({});
    }
  };

  const resolveFontVar = (value: string) => {
    switch (value) {
      case 'modern':
      case 'inter':
        return 'var(--font-inter)'
      case 'geometric_sans':
      case 'poppins':
        return 'var(--font-poppins)'
      case 'montserrat':
        return 'var(--font-montserrat)'
      case 'raleway':
        return 'var(--font-raleway)'
      case 'nunito':
        return 'var(--font-nunito)'
      case 'lato':
        return 'var(--font-lato)'
      case 'quicksand':
        return 'var(--font-quicksand)'
      case 'classic_serif':
      case 'playfair_display':
        return 'var(--font-playfair)'
      case 'merriweather':
        return 'var(--font-merriweather)'
      case 'lora':
        return 'var(--font-lora)'
      case 'roboto_slab':
        return 'var(--font-roboto-slab)'
      case 'playful':
      case 'comic_neue':
        return 'var(--font-comic-neue)'
      default:
        return 'inherit'
    }
  }

  const nextStep = useCallback(async () => {
    if (currentStep < steps.length) {
      const isValid = await isCurrentStepValid();
      if (isValid) {
        setSlideDirection(1)
        setCurrentStep(currentStep + 1)
        setShowValidationWarning(false) // Hide warning when proceeding
      } else {
        setShowValidationWarning(true) // Show warning when validation fails
      }
    }
  }, [currentStep, isCurrentStepValid]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setSlideDirection(-1)
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep]);

  const onSubmit = async (data: IntakeFormData) => {
    setIsSubmitting(true)
    setSubmissionResult(null)

    try {
      // Final validation check before submission
      const isValid = await trigger();
      if (!isValid) {
        setSubmissionResult({
          success: false,
          message: 'Please complete all required fields correctly before submitting.'
        });
        setIsSubmitting(false);
        return;
      }

      const handleResult = (result: { success: boolean; id?: string; error?: string }) => {
        setSubmissionResult({
          success: true,
          message: `Thank you! Your project has been submitted successfully. Project ID: ${result.id}`
        })
      }
      let token = tokenRef.current
      if (!token) {
        // Show captcha and wait for user to complete it
        setCaptchaVisible(true)
        token = await new Promise<string>((resolve) => {
          const timeout = setTimeout(() => resolve(''), 120000)
          tokenWaitersRef.current.push((t) => { clearTimeout(timeout); resolve(t) })
        })
      }
      if (!token && process.env.NODE_ENV !== 'production') {
        // Dev fallback: allow submission without captcha
        const result = await submitIntake(data, 'placeholder-token')
        if (result.success) handleResult(result)
        else setSubmissionResult({ success: false, message: `Submission failed: ${result.error}` })
        return
      }
      if (!token) {
        setSubmissionResult({ success: false, message: 'Please complete the captcha to continue.' })
        setIsSubmitting(false)
        return
      }
      const result = await submitIntake(data, token)
      if (result.success) {
        handleResult(result)
      } else {
        setSubmissionResult({
          success: false,
          message: `Submission failed: ${result.error}`
        })
      }
    } catch (error) {
      setSubmissionResult({
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Business Name *
                 </label>
                 <Controller
                   name="business.name"
                   control={control}
                   render={({ field }) => (
                     <input
                       {...field}
                       type="text"
                       minLength={2}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                       placeholder="Your Business Name"
                       title="Please enter your business name (at least 2 characters)"
                     />
                   )}
                 />
                                   {errors.business?.name && touchedFields.business?.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.business.name.message}</p>
                  )}
                 <p className="text-gray-500 text-xs mt-1">Enter your official business name</p>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Industry *
                 </label>
                 <Controller
                   name="business.industry"
                   control={control}
                   render={({ field }) => (
                     <div className="space-y-2">
                                               <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    onChange={(e) => {
                             const value = e.target.value;
                             field.onChange(value);
                             // Clear custom industry if selecting from dropdown
                             if (value !== 'Other') {
                               setValue('business.industry', value, { shouldValidate: false });
                               setCustomIndustry(''); // Clear custom input
                             }
                             // Trigger immediate validation for step 1
                             if (currentStep === 1) {
                               setTimeout(async () => {
                                 const isValid = await isCurrentStepValid();
                                 setIsStepValid(isValid);
                               }, 0);
                             }
                           }}
                        >
                         <option value="">Select your industry</option>
                         <option value="Restaurant & Food Service">Restaurant & Food Service</option>
                         <option value="Healthcare & Medical">Healthcare & Medical</option>
                         <option value="Legal Services">Legal Services</option>
                         <option value="Real Estate">Real Estate</option>
                         <option value="Retail & E-commerce">Retail & E-commerce</option>
                         <option value="Professional Services">Professional Services</option>
                         <option value="Beauty & Wellness">Beauty & Wellness</option>
                         <option value="Automotive">Automotive</option>
                         <option value="Education & Training">Education & Training</option>
                         <option value="Technology & Software">Technology & Software</option>
                         <option value="Manufacturing">Manufacturing</option>
                         <option value="Construction">Construction</option>
                         <option value="Non-Profit">Non-Profit</option>
                         <option value="Other">Other (specify below)</option>
                       </select>
                       
                                               {/* Custom industry input for "Other" option */}
                        {(field.value === 'Other' || (customIndustry && field.value !== 'Other')) && (
                          <input
                            type="text"
                            placeholder="Please specify your industry"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={customIndustry}
                                                         onChange={(e) => {
                               const customValue = e.target.value;
                               setCustomIndustry(customValue);
                               setValue('business.industry', customValue, { shouldValidate: false });
                               // Trigger immediate validation for step 1
                               if (currentStep === 1) {
                                 setTimeout(async () => {
                                   const isValid = await isCurrentStepValid();
                                   setIsStepValid(isValid);
                                 }, 0);
                               }
                             }}
                          />
                        )}
                     </div>
                   )}
                 />
                 {errors.business?.industry && touchedFields.business?.industry && (
                   <p className="text-red-600 text-sm mt-1">{errors.business.industry.message}</p>
                 )}
                 <p className="text-gray-500 text-xs mt-1">What type of business do you run?</p>
               </div>

               {/* Country Selection */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Country *
                 </label>
                 <Controller
                   name="business.address.country"
                   control={control}
                   render={({ field }) => (
                     <div>
                       <select
                         {...field}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                   onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value);
                            // Clear state if country changes from US
                            if (value !== 'United States') {
                              setValue('business.address.state', '', { shouldValidate: false });
                            }
                            // Clear custom country if selecting from dropdown
                            if (value !== 'Other') {
                              setCustomCountry(''); // Clear custom input
                            }
                            // Trigger immediate validation for step 1
                            if (currentStep === 1) {
                              setTimeout(async () => {
                                const isValid = await isCurrentStepValid();
                                setIsStepValid(isValid);
                              }, 0);
                            }
                          }}
                       >
                         <option value="">Select a country</option>
                         <option value="United States">United States</option>
                         <option value="Canada">Canada</option>
                         <option value="United Kingdom">United Kingdom</option>
                         <option value="Australia">Australia</option>
                         <option value="Germany">Germany</option>
                         <option value="France">France</option>
                         <option value="Japan">Japan</option>
                         <option value="Other">Other</option>
                       </select>
                       
                                               {/* Custom country input for "Other" option */}
                        {(watchedValues.business?.address?.country === 'Other' || (customCountry && watchedValues.business?.address?.country !== 'Other')) && (
                          <input
                            type="text"
                            placeholder="Please specify your country"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mt-2"
                            value={customCountry}
                                                         onChange={(e) => {
                               const customValue = e.target.value;
                               setCustomCountry(customValue);
                               setValue('business.address.country', customValue, { shouldValidate: false });
                               // Trigger immediate validation for step 1
                               if (currentStep === 1) {
                                 setTimeout(async () => {
                                   const isValid = await isCurrentStepValid();
                                   setIsStepValid(isValid);
                                 }, 0);
                               }
                             }}
                          />
                        )}
                     </div>
                   )}
                 />
                 {errors.business?.address?.country && touchedFields.business?.address?.country && (
                   <p className="text-red-600 text-sm mt-1">{errors.business.address.country.message}</p>
                 )}
               </div>

               {/* State Selection - Only for US */}
               {watchedValues.business?.address?.country === 'United States' && (
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     State *
                   </label>
                   <Controller
                     name="business.address.state"
                     control={control}
                     render={({ field }) => (
                       <select
                         {...field}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                         onChange={(e) => {
                           field.onChange(e);
                           // Trigger immediate validation for step 1
                           if (currentStep === 1) {
                             setTimeout(async () => {
                               const isValid = await isCurrentStepValid();
                               setIsStepValid(isValid);
                             }, 0);
                           }
                         }}
                       >
                         <option value="">Select a state</option>
                         <option value="AL">Alabama</option>
                         <option value="AK">Alaska</option>
                         <option value="AZ">Arizona</option>
                         <option value="AR">Arkansas</option>
                         <option value="CA">California</option>
                         <option value="CO">Colorado</option>
                         <option value="CT">Connecticut</option>
                         <option value="DE">Delaware</option>
                         <option value="FL">Florida</option>
                         <option value="GA">Georgia</option>
                         <option value="HI">Hawaii</option>
                         <option value="ID">Idaho</option>
                         <option value="IL">Illinois</option>
                         <option value="IN">Indiana</option>
                         <option value="IA">Iowa</option>
                         <option value="KS">Kansas</option>
                         <option value="KY">Kentucky</option>
                         <option value="LA">Louisiana</option>
                         <option value="ME">Maine</option>
                         <option value="MD">Maryland</option>
                         <option value="MA">Massachusetts</option>
                         <option value="MI">Michigan</option>
                         <option value="MN">Minnesota</option>
                         <option value="MS">Mississippi</option>
                         <option value="MO">Missouri</option>
                         <option value="MT">Montana</option>
                         <option value="NE">Nebraska</option>
                         <option value="NV">Nevada</option>
                         <option value="NH">New Hampshire</option>
                         <option value="NJ">New Jersey</option>
                         <option value="NM">New Mexico</option>
                         <option value="NY">New York</option>
                         <option value="NC">North Carolina</option>
                         <option value="ND">North Dakota</option>
                         <option value="OH">Ohio</option>
                         <option value="OK">Oklahoma</option>
                         <option value="OR">Oregon</option>
                         <option value="PA">Pennsylvania</option>
                         <option value="RI">Rhode Island</option>
                         <option value="SC">South Carolina</option>
                         <option value="SD">South Dakota</option>
                         <option value="TN">Tennessee</option>
                         <option value="TX">Texas</option>
                         <option value="UT">Utah</option>
                         <option value="VT">Vermont</option>
                         <option value="VA">Virginia</option>
                         <option value="WA">Washington</option>
                         <option value="WV">West Virginia</option>
                         <option value="WI">Wisconsin</option>
                         <option value="WY">Wyoming</option>
                       </select>
                     )}
                   />
                                       {errors.business?.address?.state && touchedFields.business?.address?.state && (
                      <p className="text-red-600 text-sm mt-1">{errors.business.address.state.message}</p>
                    )}
                 </div>
               )}

               {/* Street Address */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Street Address *
                 </label>
                 <Controller
                   name="business.address.streetAddress"
                   control={control}
                   render={({ field }) => (
                                             <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="123 Main Street"
                          title="Please enter your street address"
                        />
                   )}
                 />
                 {errors.business?.address?.streetAddress && touchedFields.business?.address?.streetAddress && (
                   <p className="text-red-600 text-sm mt-1">{errors.business.address.streetAddress.message}</p>
                 )}
               </div>

               {/* City */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   City *
                 </label>
                 <Controller
                   name="business.address.city"
                   control={control}
                   render={({ field }) => (
                     <input
                       {...field}
                       type="text"
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                       placeholder="City Name"
                       title="Please enter your city"
                     />
                   )}
                 />
                 {errors.business?.address?.city && touchedFields.business?.address?.city && (
                   <p className="text-red-600 text-sm mt-1">{errors.business.address.city.message}</p>
                 )}
               </div>

               {/* ZIP/Postal Code */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   ZIP/Postal Code *
                 </label>
                 <Controller
                   name="business.address.zipCode"
                   control={control}
                   render={({ field }) => (
                     <input
                       {...field}
                       type="text"
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                       placeholder="12345 or A1B 2C3"
                       title="Please enter your ZIP or postal code"
                     />
                   )}
                 />
                 {errors.business?.address?.zipCode && touchedFields.business?.address?.zipCode && (
                   <p className="text-red-600 text-sm mt-1">{errors.business.address.zipCode.message}</p>
                 )}
               </div>

                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Phone *
                 </label>
                 <Controller
                   name="business.phone"
                   control={control}
                   render={({ field }) => (
                     <input
                       {...field}
                       type="tel"
                       pattern="[\d\s\(\)\-\+\.\-]+"
                       minLength={10}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                       placeholder="(555) 123-4567"
                       title="Please enter a valid phone number with area code (e.g., 555-123-4567)"
                     />
                   )}
                 />
                 {errors.business?.phone && touchedFields.business?.phone && (
                   <p className="text-red-600 text-sm mt-1">{errors.business.phone.message}</p>
                 )}
                 <p className="text-gray-500 text-xs mt-1">Include area code: (555) 123-4567 or 555-123-4567</p>
               </div>

                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Domain (Optional)
                 </label>
                 <Controller
                   name="business.domain"
                   control={control}
                   render={({ field }) => (
                     <input
                       {...field}
                       type="text"
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                       placeholder="yourbusiness.com or https://yourbusiness.com"
                       title="Enter your website domain if you have one"
                     />
                   )}
                 />
                 <p className="text-gray-500 text-xs mt-1">Leave blank if you don't have a website yet</p>
               </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Goals & Pages</h2>
            
            <div className="space-y-6">
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-3">
                   What are your main conversion goals? *
                 </label>
                 <div className="grid gap-3 md:grid-cols-2">
                   {[
                     { value: 'calls', label: 'Phone Calls', description: 'Get customers to call you' },
                     { value: 'bookings', label: 'Appointments', description: 'Schedule consultations or services' },
                     { value: 'orders', label: 'Online Orders', description: 'Sell products directly' },
                     { value: 'lead_form', label: 'Lead Capture', description: 'Collect contact information' },
                     { value: 'not_sure', label: 'Not Sure Yet', description: 'Help me figure this out!' }
                   ].map((goal) => (
                     <label key={goal.value} className="flex items-start space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                       <Controller
                         name="goals.conversions"
                         control={control}
                         render={({ field }) => (
                           <input
                             type="checkbox"
                             checked={field.value.includes(goal.value as any)}
                             onChange={(e) => {
                               if (e.target.checked) {
                                 field.onChange([...field.value, goal.value])
                               } else {
                                 field.onChange(field.value.filter((g: string) => g !== goal.value))
                               }
                               // Trigger immediate validation for step 2
                               if (currentStep === 2) {
                                 setTimeout(async () => {
                                   const isValid = await isCurrentStepValid();
                                   setIsStepValid(isValid);
                                 }, 0);
                               }
                             }}
                             className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-1"
                           />
                         )}
                       />
                       <div className="flex-1">
                         <span className="text-sm font-medium text-gray-700 block">
                           {goal.label}
                         </span>
                         <span className="text-xs text-gray-500 block">
                           {goal.description}
                         </span>
                       </div>
                     </label>
                   ))}
                 </div>
                 {errors.goals?.conversions && touchedFields.goals?.conversions && (
                   <p className="text-red-600 text-sm mt-1">{errors.goals.conversions.message}</p>
                 )}
                 <p className="text-gray-500 text-xs mt-2">Don't worry if you're not sure - we'll help you figure out the best approach for your business!</p>
               </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What pages do you need? *
                </label>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    { value: 'Home', description: 'Your main landing page' },
                    { value: 'About', description: 'Tell your story' },
                    { value: 'Services', description: 'What you offer' },
                    { value: 'Contact', description: 'How to reach you' },
                    { value: 'Blog', description: 'Share your expertise' },
                    { value: 'Menu', description: 'Show your offerings' },
                    { value: 'Products', description: 'Display your goods' },
                    { value: 'not_sure', description: 'Help me decide!' }
                  ].map((page) => (
                    <label key={page.value} className="flex items-start space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Controller
                        name="goals.pages"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="checkbox"
                            checked={field.value.includes(page.value as any)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, page.value])
                              } else {
                                field.onChange(field.value.filter((p: string) => p !== page.value))
                              }
                              // Trigger immediate validation for step 2
                              if (currentStep === 2) {
                                setTimeout(async () => {
                                  const isValid = await isCurrentStepValid();
                                  setIsStepValid(isValid);
                                }, 0);
                              }
                            }}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-1"
                          />
                        )}
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700 block">
                          {page.value === 'not_sure' ? 'Not Sure Yet' : page.value}
                        </span>
                        <span className="text-xs text-gray-500 block">
                          {page.description}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                                 {errors.goals?.pages && touchedFields.goals?.pages && (
                   <p className="text-red-600 text-sm mt-1">{errors.goals.pages.message}</p>
                 )}
                <p className="text-gray-500 text-xs mt-2">We'll help you choose the right pages for your business goals!</p>
              </div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Style & Colors</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Brand Color *
                </label>
                <Controller
                  name="color.brand"
                  control={control}
                  render={({ field }) => (
                    <ColorWheel
                      value={field.value}
                      onChange={(color) => {
                        field.onChange(color);
                        // Trigger immediate validation for step 3
                        if (currentStep === 3) {
                          setTimeout(async () => {
                            const isValid = await isCurrentStepValid();
                            setIsStepValid(isValid);
                          }, 0);
                        }
                      }}
                      onPaletteChange={(palette) => setValue('color.palette', palette)}
                      harmony={(watchedValues as any)?.color?.harmony || 'tetrad'}
                      onHarmonyChange={(h) => setValue('color.harmony', h, { shouldValidate: true })}
                    />
                  )}
                />
              </div>



              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Typography Style
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Headings</label>
                    <Controller
                      name="fonts.headings"
                      control={control}
                      render={({ field }) => (
                        <FontVariablesProvider>
                          <select
                            {...field}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            style={{ fontFamily: resolveFontVar(field.value) }}
                            onChange={(e) => {
                              field.onChange(e);
                              // Trigger immediate validation for step 3
                              if (currentStep === 3) {
                                setTimeout(async () => {
                                  const isValid = await isCurrentStepValid();
                                  setIsStepValid(isValid);
                                }, 0);
                              }
                            }}
                          >
                            {/* Categories (original options) */}
                            <option value="modern" style={{ fontFamily: 'var(--font-inter)' }}>Modern Sans (Inter)</option>
                            <option value="classic_serif" style={{ fontFamily: 'var(--font-playfair)' }}>Classic Serif (Playfair Display)</option>
                            <option value="geometric_sans" style={{ fontFamily: 'var(--font-poppins)' }}>Geometric Sans (Poppins)</option>
                            <option value="playful" style={{ fontFamily: 'var(--font-comic-neue)' }}>Playful (Comic Neue)</option>

                            {/* Specific font families */}
                            <option value="inter" style={{ fontFamily: 'var(--font-inter)' }}>Inter</option>
                            <option value="poppins" style={{ fontFamily: 'var(--font-poppins)' }}>Poppins</option>
                            <option value="montserrat" style={{ fontFamily: 'var(--font-montserrat)' }}>Montserrat</option>
                            <option value="raleway" style={{ fontFamily: 'var(--font-raleway)' }}>Raleway</option>
                            <option value="nunito" style={{ fontFamily: 'var(--font-nunito)' }}>Nunito</option>
                            <option value="lato" style={{ fontFamily: 'var(--font-lato)' }}>Lato</option>
                            <option value="quicksand" style={{ fontFamily: 'var(--font-quicksand)' }}>Quicksand</option>
                            <option value="playfair_display" style={{ fontFamily: 'var(--font-playfair)' }}>Playfair Display</option>
                            <option value="merriweather" style={{ fontFamily: 'var(--font-merriweather)' }}>Merriweather</option>
                            <option value="lora" style={{ fontFamily: 'var(--font-lora)' }}>Lora</option>
                            <option value="roboto_slab" style={{ fontFamily: 'var(--font-roboto-slab)' }}>Roboto Slab</option>
                            <option value="comic_neue" style={{ fontFamily: 'var(--font-comic-neue)' }}>Comic Neue</option>
                          </select>
                        </FontVariablesProvider>
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Body Text</label>
                    <Controller
                      name="fonts.body"
                      control={control}
                      render={({ field }) => (
                        <FontVariablesProvider>
                          <select
                            {...field}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            style={{ fontFamily: resolveFontVar(field.value) }}
                            onChange={(e) => {
                              field.onChange(e);
                              // Trigger immediate validation for step 3
                              if (currentStep === 3) {
                                setTimeout(async () => {
                                  const isValid = await isCurrentStepValid();
                                  setIsStepValid(isValid);
                                }, 0);
                              }
                            }}
                          >
                            {/* Categories (original options) */}
                            <option value="modern" style={{ fontFamily: 'var(--font-inter)' }}>Modern Sans (Inter)</option>
                            <option value="classic_serif" style={{ fontFamily: 'var(--font-playfair)' }}>Classic Serif (Playfair Display)</option>
                            <option value="geometric_sans" style={{ fontFamily: 'var(--font-poppins)' }}>Geometric Sans (Poppins)</option>
                            <option value="playful" style={{ fontFamily: 'var(--font-comic-neue)' }}>Playful (Comic Neue)</option>

                            {/* Specific font families */}
                            <option value="inter" style={{ fontFamily: 'var(--font-inter)' }}>Inter</option>
                            <option value="poppins" style={{ fontFamily: 'var(--font-poppins)' }}>Poppins</option>
                            <option value="montserrat" style={{ fontFamily: 'var(--font-montserrat)' }}>Montserrat</option>
                            <option value="raleway" style={{ fontFamily: 'var(--font-raleway)' }}>Raleway</option>
                            <option value="nunito" style={{ fontFamily: 'var(--font-nunito)' }}>Nunito</option>
                            <option value="lato" style={{ fontFamily: 'var(--font-lato)' }}>Lato</option>
                            <option value="quicksand" style={{ fontFamily: 'var(--font-quicksand)' }}>Quicksand</option>
                            <option value="playfair_display" style={{ fontFamily: 'var(--font-playfair)' }}>Playfair Display</option>
                            <option value="merriweather" style={{ fontFamily: 'var(--font-merriweather)' }}>Merriweather</option>
                            <option value="lora" style={{ fontFamily: 'var(--font-lora)' }}>Lora</option>
                            <option value="roboto_slab" style={{ fontFamily: 'var(--font-roboto-slab)' }}>Roboto Slab</option>
                            <option value="comic_neue" style={{ fontFamily: 'var(--font-comic-neue)' }}>Comic Neue</option>
                          </select>
                        </FontVariablesProvider>
                      )}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      const headingOptions = ['inter','poppins','montserrat','raleway','nunito','lato','quicksand','playfair_display','merriweather','lora','roboto_slab','comic_neue']
                      const bodyOptions = ['inter','poppins','montserrat','raleway','nunito','lato','quicksand','playfair_display','merriweather','lora','roboto_slab','comic_neue']
                      const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
                      setValue('fonts.headings', rand(headingOptions) as any, { shouldValidate: true })
                      setValue('fonts.body', rand(bodyOptions) as any, { shouldValidate: true })
                    }}
                    className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-900"
                  >
                    Randomize fonts
                  </button>
                </div>
                <FontVariablesProvider>
                  <div className="mt-4 space-y-2">
                    <div
                      className="text-xl font-bold text-gray-900"
                      style={{ fontFamily: resolveFontVar(watchedValues.fonts?.headings || 'inter') }}
                    >
                      Heading Preview
                    </div>
                    <div
                      className="text-gray-700"
                      style={{ fontFamily: resolveFontVar(watchedValues.fonts?.body || 'inter') }}
                    >
                      The quick brown fox jumps over the lazy dog.
                    </div>
                  </div>
                </FontVariablesProvider>
              </div>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Design Inspiration</h2>
            
            <Controller
              name="templates"
              control={control}
              render={({ field }) => (
                <Controller
                  name="referenceUrls"
                  control={control}
                  render={({ field: refField }) => (
                    <TemplatePicker
                      selectedTemplates={field.value}
                      onTemplatesChange={(templates) => {
                        field.onChange(templates);
                        // Trigger immediate validation for step 4
                        if (currentStep === 4) {
                          setTimeout(async () => {
                            const isValid = await isCurrentStepValid();
                            setIsStepValid(isValid);
                          }, 0);
                        }
                      }}
                      referenceUrls={refField.value || []}
                      onReferenceUrlsChange={refField.onChange}
                    />
                  )}
                />
              )}
            />
            
                         {errors.templates && touchedFields.templates && (
               <p className="text-red-600 text-sm">{errors.templates.message}</p>
             )}
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            key="step-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Additional Features</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select additional features you'd like:
              </label>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { value: 'booking', label: 'Booking System', description: 'Schedule appointments online' },
                  { value: 'menu_catalog', label: 'Menu/Catalog', description: 'Show your products or services' },
                  { value: 'gift_cards', label: 'Gift Cards', description: 'Sell digital gift cards' },
                  { value: 'testimonials', label: 'Testimonials', description: 'Display customer reviews' },
                  { value: 'gallery', label: 'Photo Gallery', description: 'Showcase your work' },
                  { value: 'blog', label: 'Blog', description: 'Share your expertise' },
                  { value: 'faq', label: 'FAQ Section', description: 'Answer common questions' },
                  { value: 'map', label: 'Location Map', description: 'Show where you are' },
                  { value: 'hours', label: 'Business Hours', description: 'Display your schedule' },
                  { value: 'contact_form', label: 'Contact Form', description: 'Easy way to reach you' },
                  { value: 'chat', label: 'Live Chat', description: 'Real-time customer support' },
                  { value: 'analytics', label: 'Analytics', description: 'Track website performance' },
                  { value: 'not_sure', label: 'Not Sure Yet', description: 'Help me choose!' }
                ].map((feature) => (
                  <label key={feature.value} className="flex items-start space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Controller
                      name="features"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value?.includes(feature.value as any) || false}
                          onChange={(e) => {
                            const currentFeatures = field.value || []
                            if (e.target.checked) {
                              field.onChange([...currentFeatures, feature.value])
                            } else {
                              field.onChange(currentFeatures.filter((f: string) => f !== feature.value))
                            }
                            // Trigger immediate validation for step 5
                            if (currentStep === 5) {
                              setTimeout(async () => {
                                const isValid = await isCurrentStepValid();
                                setIsStepValid(isValid);
                              }, 0);
                            }
                          }}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-1"
                        />
                      )}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700 block">
                        {feature.label}
                      </span>
                      <span className="text-xs text-gray-500 block">
                        {feature.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-3">Don't worry about choosing everything now - we can always add features later as your business grows!</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline
                </label>
                <Controller
                  name="admin.timeline"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="1-2_weeks">1-2 weeks</option>
                      <option value="3-4_weeks">3-4 weeks</option>
                      <option value="1-2_months">1-2 months</option>
                      <option value="3+_months">3+ months</option>
                    </select>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan
                </label>
                <Controller
                  name="admin.plan"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                    </select>
                  )}
                />
              </div>
            </div>
          </motion.div>
        )

      case 6:
        return (
          <motion.div
            key="step-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Review & Submit</h2>
              <p className="text-gray-600 text-lg">You're almost done! Review your selections below and submit your project request.</p>
            </div>
            
            <div className="space-y-6">
              {/* Business Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold text-sm">🏢</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="ml-auto px-3 py-1.5 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Business Name</span>
                    <p className="text-gray-900 font-medium">{watchedValues.business?.name || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Industry</span>
                    <p className="text-gray-900 font-medium">{watchedValues.business?.industry || 'Not specified'}</p>
                  </div>
                                     <div>
                     <span className="text-sm font-medium text-gray-500">Address</span>
                     <p className="text-gray-900">
                       {watchedValues.business?.address ? 
                         `${watchedValues.business.address.streetAddress}, ${watchedValues.business.address.city}${watchedValues.business.address.state ? `, ${watchedValues.business.address.state}` : ''}, ${watchedValues.business.address.zipCode}, ${watchedValues.business.address.country}`.replace(/,\s*,/g, ',').replace(/^\s*,\s*/, '').replace(/\s*,\s*$/, '')
                         : 'Not specified'
                       }
                     </p>
                   </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Phone</span>
                    <p className="text-gray-900">{watchedValues.business?.phone || 'Not specified'}</p>
                  </div>
                  {watchedValues.business?.domain && (
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium text-gray-500">Domain</span>
                      <p className="text-gray-900">{watchedValues.business.domain}</p>
                    </div>
                  )}
                  {watchedValues.business?.socials && Object.values(watchedValues.business.socials).some(social => social) && (
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium text-gray-500">Social Media</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.entries(watchedValues.business.socials).map(([platform, url]) => 
                          url ? (
                            <a 
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                            >
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </a>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Goals & Pages */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold text-sm">🎯</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Goals & Pages</h3>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="ml-auto px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                                     <div>
                     <span className="text-sm font-medium text-gray-500">Conversion Goals</span>
                     <div className="mt-2 flex flex-wrap gap-2">
                       {watchedValues.goals?.conversions?.filter(goal => goal !== 'not_sure').map((goal) => (
                         <span key={goal} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                           {goal.replace('_', ' ')}
                         </span>
                       )) || <span className="text-gray-400">None selected</span>}
                       {watchedValues.goals?.conversions?.includes('not_sure') && (
                         <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                           Need help deciding
                         </span>
                       )}
                     </div>
                   </div>
                                     <div>
                     <span className="text-sm font-medium text-gray-500">Required Pages</span>
                     <div className="mt-2 flex flex-wrap gap-2">
                       {watchedValues.goals?.pages?.filter(page => page !== 'not_sure').map((page) => (
                         <span key={page} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                           {page}
                         </span>
                       )) || <span className="text-gray-400">None selected</span>}
                       {watchedValues.goals?.pages?.includes('not_sure') && (
                         <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                           Need help deciding
                         </span>
                       )}
                     </div>
                   </div>
                </div>
              </div>

              {/* Style & Design */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold text-sm">🎨</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Style & Design</h3>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="ml-auto px-3 py-1.5 text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 transition-colors"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Brand Color</span>
                    <div className="mt-2 flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-200"
                        style={{ backgroundColor: watchedValues.color?.brand }}
                      />
                      <span className="text-gray-900 font-mono">{watchedValues.color?.brand}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500">Heading Font</span>
                    <p className="text-gray-900 capitalize">{watchedValues.fonts?.headings?.replace('_', ' ') || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Body Font</span>
                    <p className="text-gray-900 capitalize">{watchedValues.fonts?.body?.replace('_', ' ') || 'Not specified'}</p>
                  </div>
                  {watchedValues.color?.palette && watchedValues.color.palette.length > 1 && (
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium text-gray-500">Color Palette</span>
                      <div className="mt-2 flex gap-2">
                        {watchedValues.color.palette.map((color, index) => (
                          <div 
                            key={index}
                            className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Click on colors to see hex values</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Templates & References */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-semibold text-sm">📋</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Design Inspiration</h3>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="ml-auto px-3 py-1.5 text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Selected Inspiration</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {watchedValues.templates?.map((template) => (
                        <span key={template} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                          {template}
                        </span>
                      )) || <span className="text-gray-400">None selected</span>}
                    </div>
                  </div>
                  {watchedValues.referenceUrls && watchedValues.referenceUrls.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Reference URLs</span>
                      <div className="mt-2 space-y-2">
                        {watchedValues.referenceUrls.map((url, index) => (
                          <a 
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 hover:text-blue-800 text-sm break-all"
                          >
                            {url}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content & Assets */}
              {(watchedValues.content?.tagline || watchedValues.content?.about || watchedValues.assets?.logoUrl) && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-pink-600 font-semibold text-sm">📝</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Content & Assets</h3>
                  </div>
                  <div className="space-y-4">
                    {watchedValues.content?.tagline && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Tagline</span>
                        <p className="text-gray-900 italic">"{watchedValues.content.tagline}"</p>
                      </div>
                    )}
                    {watchedValues.content?.about && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">About Text</span>
                        <p className="text-gray-900">{watchedValues.content.about}</p>
                      </div>
                    )}
                    {watchedValues.assets?.logoUrl && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Logo URL</span>
                        <a 
                          href={watchedValues.assets.logoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:text-blue-800 text-sm break-all"
                        >
                          {watchedValues.assets.logoUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Features & Timeline */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-indigo-600 font-semibold text-sm">⚡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Features & Timeline</h3>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="ml-auto px-3 py-1.5 text-sm text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                                     <div>
                     <span className="text-sm font-medium text-gray-500">Additional Features</span>
                     <div className="mt-2 flex flex-wrap gap-2">
                       {watchedValues.features && watchedValues.features.length > 0 ? (
                         <>
                           {watchedValues.features.filter(feature => feature !== 'not_sure').map((feature) => (
                             <span key={feature} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                               {feature.replace('_', ' ')}
                             </span>
                           ))}
                           {watchedValues.features.includes('not_sure') && (
                             <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                               Need help deciding
                             </span>
                           )}
                         </>
                       ) : (
                         <span className="text-gray-400">None selected</span>
                       )}
                     </div>
                   </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Timeline</span>
                    <p className="text-gray-900 capitalize">
                      {watchedValues.admin?.timeline?.replace('_', ' ') || '3-4 weeks'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Plan</span>
                    <p className="text-gray-900 capitalize">{watchedValues.admin?.plan || 'standard'}</p>
                  </div>
                  {watchedValues.admin?.launchWindow && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Launch Window</span>
                      <p className="text-gray-900">{watchedValues.admin.launchWindow}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold text-sm">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900">Project Summary</h3>
                </div>
                <div className="text-blue-800">
                  <p className="mb-2">
                    <strong>{watchedValues.business?.name || 'Your business'}</strong> will receive a custom website with the following pages: {' '}
                    <strong>{(watchedValues.goals?.pages?.filter((p) => p !== 'not_sure') || []).join(', ') || 'None selected'}</strong>.
                    It will be designed to drive these conversion goals: {' '}
                    <strong>{(watchedValues.goals?.conversions?.filter((g) => g !== 'not_sure').map((g) => GOAL_LABELS[g as keyof typeof GOAL_LABELS]) || []).join(', ') || 'None selected'}</strong>
                    {watchedValues.goals?.conversions?.includes('not_sure') ? ' (Need help deciding)' : ''}.
                  </p>
                  <p className="mb-2">
                    The design will feature a primary color of <strong>{watchedValues.color?.brand}</strong>, using {' '}
                    <strong>{watchedValues.fonts?.headings?.replace('_', ' ')}</strong> headings and {' '}
                    <strong>{watchedValues.fonts?.body?.replace('_', ' ')}</strong> body text.
                    {watchedValues.color?.palette && watchedValues.color.palette.length > 1 ? ' Supporting palette: ' : ''}
                    {watchedValues.color?.palette && watchedValues.color.palette.length > 1 ? watchedValues.color.palette.join(', ') : ''}
                    .
                  </p>
                  <p className="mb-2">
                    Inspiration: <strong>{(watchedValues.templates || []).join(', ') || 'None selected'}</strong>.
                    {' '}Additional features: <strong>{(watchedValues.features || []).filter((f) => f !== 'not_sure').map((f) => f.replace('_', ' ')).join(', ') || 'None selected'}</strong>
                    {watchedValues.features?.includes('not_sure') ? ' (Need help deciding)' : ''}.
                  </p>
                  <p>
                    Timeline: <strong>{watchedValues.admin?.timeline?.replace('_', ' ') || '3-4 weeks'}</strong>; Plan: <strong>{watchedValues.admin?.plan || 'standard'}</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-gray-200">
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full px-8 py-4 text-white text-lg font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
                  style={({ 
                    backgroundColor: getButtonColor(),
                    color: getButtonTextColor(),
                    ['--tw-shadow-color' as any]: getButtonColor(),
                    ['--tw-shadow' as any]: `0 10px 15px -3px ${getButtonColor()}40, 0 4px 6px -4px ${getButtonColor()}40`
                  } as React.CSSProperties)}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Submitting Your Project...
                    </div>
                  ) : (
                    'Submit Project Request'
                  )}
                </button>
                <p className="text-center text-gray-500 text-sm mt-3">
                  Review your selections above and click submit when ready
                </p>
              </div>
            </div>

            {submissionResult && (
              <div className={`p-4 rounded-lg ${
                submissionResult.success 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submissionResult.message}
              </div>
            )}
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
             {/* Progress Bar - Carousel */}
       <div className="mb-8 bg-white/95 backdrop-blur-sm py-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative mb-4">
          {/* Edge indicators (lines going off-screen) */}
          {currentStep > 3 && (
            <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-8 bg-gray-300" />
          )}
          {steps.length - currentStep > 2 && (
            <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-8 bg-gray-300" />
          )}

          <div className="overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={currentStep}
                initial={{ x: slideDirection * 40, opacity: 0.9 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -slideDirection * 40, opacity: 0.9 }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="flex items-center justify-center gap-3 sm:gap-4"
              >
                {(() => {
                  const currentIndex = currentStep - 1
                  const visible: Array<{ id: number; title: string; description: string; index: number }> = []
                  for (let i = currentIndex - 2; i <= currentIndex + 2; i++) {
                    if (i >= 0 && i < steps.length) {
                      visible.push({ ...steps[i], index: i })
                    }
                  }

                  return visible.map((step, idx) => {
                    const distance = Math.abs(step.index - currentIndex)
                    const sizeClass = distance === 0
                      ? 'w-12 h-12 text-base'
                      : distance === 1
                      ? 'w-8 h-8 text-sm'
                      : 'w-6 h-6 text-xs'
                    const circleActive = currentStep >= step.id
                    const isCompleted = currentStep > step.id

                    const circleClass = circleActive
                      ? 'text-white'
                      : 'border-gray-300 bg-white text-gray-500'

                    return (
                      <div key={step.id} className="flex items-center">
                        <div 
                          className={`flex items-center justify-center rounded-full border-2 ${sizeClass} ${circleClass}`}
                          style={circleActive ? { 
                            backgroundColor: getButtonColor(),
                            borderColor: getButtonColor()
                          } : {}}
                        >
                          {isCompleted ? (
                            <Check className={distance === 0 ? 'w-6 h-6' : distance === 1 ? 'w-4 h-4' : 'w-3 h-3'} />
                          ) : (
                            step.id
                          )}
                        </div>

                        {idx < visible.length - 1 && (
                          <div
                            className={`h-0.5 mx-1 sm:mx-2 ${distance === 0 ? 'w-12 sm:w-16' : distance === 1 ? 'w-10 sm:w-12' : 'w-8 sm:w-10'} ${
                              // Connector is active if the next step is <= current step
                              visible[idx + 1].id <= currentStep ? '' : 'bg-gray-300'
                            }`}
                            style={visible[idx + 1].id <= currentStep ? { backgroundColor: getButtonColor() } : {}}
                          />
                        )}
                      </div>
                    )
                  })
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-gray-600">{steps[currentStep - 1].description}</p>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {/* Navigation */}
        <div className="pt-6 border-t">
                     {/* Validation Message - Only show when user tries to proceed */}
           {currentStep < steps.length && showValidationWarning && !isStepValid && (
             <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
               <p className="text-yellow-800 text-sm">
                 Please complete all required fields in this step before continuing.
               </p>
             </div>
           )}
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            {currentStep < steps.length ? (
                           <button
               type="button"
               onClick={nextStep}
               disabled={!isStepValid}
               className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
                 isStepValid 
                   ? 'text-white' 
                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
               }`}
               style={isStepValid ? ({ 
                 backgroundColor: getButtonColor(),
                 color: getButtonTextColor(),
                 ['--tw-shadow-color' as any]: getButtonColor(),
                 ['--tw-shadow' as any]: `0 4px 6px -1px ${getButtonColor()}40, 0 2px 4px -1px ${getButtonColor()}40`
               } as React.CSSProperties) : {}}
             >
               Next
               <ChevronRight className="w-4 h-4 ml-2" />
             </button>
            ) : (
              <button
                type="submit"
                disabled={!isValid || isSubmitting || !canSubmit}
                className="flex items-center px-6 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={({ 
                  backgroundColor: getButtonColor(),
                  color: getButtonTextColor(),
                  ['--tw-shadow-color' as any]: getButtonColor(),
                  ['--tw-shadow' as any]: `0 4px 6px -1px ${getButtonColor()}40, 0 2px 4px -1px ${getButtonColor()}40`
                } as React.CSSProperties)}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Project'}
              </button>
            )}
          </div>
        </div>
      </form>
      {/* Cloudflare Turnstile invisible widget (renders if site key provided) */}
      {mounted && (
        <div
          ref={turnstileContainerRef}
          suppressHydrationWarning
          style={{ width: (process.env.NEXT_PUBLIC_TURNSTILE_MODE === 'visible' || captchaVisible) ? '100%' : 0, height: (process.env.NEXT_PUBLIC_TURNSTILE_MODE === 'visible' || captchaVisible) ? 'auto' : 0, overflow: 'hidden' }}
        />
      )}
    </div>
  )
}
