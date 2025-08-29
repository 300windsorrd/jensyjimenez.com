import { IntakeFormData } from './schema'

export interface SEOConfig {
  title: string
  description: string
  keywords: string[]
  ogImage: string
  twitterImage: string
  url: string
}

export function generateSEOConfig(intake: IntakeFormData): SEOConfig {
  const businessName = intake.business.name
  const industry = intake.business.industry
  
  return {
    title: `${businessName} - Professional ${industry} Services`,
    description: `Transform your ${industry} business with our professional web design services. Get a custom website that converts visitors into customers.`,
    keywords: [businessName, industry, 'web design', 'website', 'digital marketing', 'business'],
    ogImage: `/api/og?business=${encodeURIComponent(businessName)}&industry=${encodeURIComponent(industry)}`,
    twitterImage: `/api/og?business=${encodeURIComponent(businessName)}&industry=${encodeURIComponent(industry)}`,
    url: intake.business.domain || `https://example.com/${intake.business.name.toLowerCase().replace(/\s+/g, '-')}`
  }
}

export function generateLocalBusinessSchema(intake: IntakeFormData) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": intake.business.name,
    "description": `Professional ${intake.business.industry} services`,
    "url": intake.business.domain,
    "telephone": intake.business.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": intake.business.address
    },
    "areaServed": {
      "@type": "City",
      "name": "Local Area"
    },
    "serviceType": intake.business.industry,
    "priceRange": "$$",
    "openingHours": "Mo-Fr 09:00-17:00",
    "sameAs": [
      intake.business.socials?.facebook,
      intake.business.socials?.instagram,
      intake.business.socials?.twitter,
      intake.business.socials?.linkedin
    ].filter(Boolean)
  }
  
  return schema
}

export function generateWebSiteSchema(intake: IntakeFormData) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": `${intake.business.name} Website`,
    "url": intake.business.domain || "https://example.com",
    "description": `Official website of ${intake.business.name}`,
    "publisher": {
      "@type": "Organization",
      "name": intake.business.name
    }
  }
}

export function generateOrganizationSchema(intake: IntakeFormData) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": intake.business.name,
    "url": intake.business.domain,
    "logo": intake.assets?.logoUrl,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": intake.business.phone,
      "contactType": "customer service"
    },
    "sameAs": [
      intake.business.socials?.facebook,
      intake.business.socials?.instagram,
      intake.business.socials?.twitter,
      intake.business.socials?.linkedin
    ].filter(Boolean)
  }
}
