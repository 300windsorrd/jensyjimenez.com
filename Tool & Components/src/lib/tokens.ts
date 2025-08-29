import { IntakeFormData } from './schema'

export interface DesignTokens {
  colors: {
    primary: string
    secondary: string
    accent: string
    neutral: string
    success: string
    warning: string
    error: string
  }
  fonts: {
    headings: string
    body: string
  }
  radius: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
  }
}

const fontMap = {
  // Category presets
  modern: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  classic_serif: "'Playfair Display', Georgia, 'Times New Roman', serif",
  geometric_sans: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  playful: "'Comic Neue', 'Comic Sans MS', cursive, sans-serif",
  // Specific families
  inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  poppins: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  montserrat: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  raleway: "'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  nunito: "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  lato: "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  quicksand: "'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  playfair_display: "'Playfair Display', Georgia, 'Times New Roman', serif",
  merriweather: "'Merriweather', Georgia, 'Times New Roman', serif",
  lora: "'Lora', Georgia, 'Times New Roman', serif",
  roboto_slab: "'Roboto Slab', Georgia, 'Times New Roman', serif",
  comic_neue: "'Comic Neue', 'Comic Sans MS', cursive, sans-serif"
}

const defaultTokens: DesignTokens = {
  colors: {
    primary: '#3B82F6',
    secondary: '#64748B',
    accent: '#F59E0B',
    neutral: '#F8FAFC',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  fonts: {
    headings: fontMap.modern,
    body: fontMap.modern
  },
  radius: {
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem'
  }
}

export function generateTokens(intake: IntakeFormData): DesignTokens {
  const brandColor = intake.color.brand
  const palette = intake.color.palette
  
  // Generate color harmonies based on the brand color
  const colors = generateColorHarmony(brandColor, palette)
  
  return {
    ...defaultTokens,
    colors,
    fonts: {
      headings: fontMap[intake.fonts.headings],
      body: fontMap[intake.fonts.body]
    }
  }
}

function generateColorHarmony(brandColor: string, palette: string[]): DesignTokens['colors'] {
  // Use the first palette color as primary, brand as accent
  const primary = palette[0] || brandColor
  const accent = brandColor
  
  // Generate complementary and analogous colors
  const secondary = generateComplementary(primary)
  const neutral = generateNeutral(primary)
  const success = generateSuccess(primary)
  const warning = generateWarning(primary)
  const error = generateError(primary)
  
  return {
    primary,
    secondary,
    accent,
    neutral,
    success,
    warning,
    error
  }
}

function generateComplementary(color: string): string {
  // Simple complementary color generation
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  const complementary = `#${(255 - r).toString(16).padStart(2, '0')}${(255 - g).toString(16).padStart(2, '0')}${(255 - b).toString(16).padStart(2, '0')}`
  return complementary
}

function generateNeutral(color: string): string {
  // Generate a neutral color based on the primary
  return '#F8FAFC'
}

function generateSuccess(color: string): string {
  return '#10B981'
}

function generateWarning(color: string): string {
  return '#F59E0B'
}

function generateError(color: string): string {
  return '#EF4444'
}

export function applyTokensToDOM(tokens: DesignTokens): void {
  const root = document.documentElement
  
  // Apply colors
  root.style.setProperty('--color-primary', tokens.colors.primary)
  root.style.setProperty('--color-secondary', tokens.colors.secondary)
  root.style.setProperty('--color-accent', tokens.colors.accent)
  root.style.setProperty('--color-neutral', tokens.colors.neutral)
  root.style.setProperty('--color-success', tokens.colors.success)
  root.style.setProperty('--color-warning', tokens.colors.warning)
  root.style.setProperty('--color-error', tokens.colors.error)
  
  // Apply fonts
  root.style.setProperty('--font-headings', tokens.fonts.headings)
  root.style.setProperty('--font-body', tokens.fonts.body)
  
  // Apply radius
  root.style.setProperty('--radius-xs', tokens.radius.xs)
  root.style.setProperty('--radius-sm', tokens.radius.sm)
  root.style.setProperty('--radius-md', tokens.radius.md)
  root.style.setProperty('--radius-lg', tokens.radius.lg)
  root.style.setProperty('--radius-xl', tokens.radius.xl)
  
  // Apply spacing
  root.style.setProperty('--spacing-xs', tokens.spacing.xs)
  root.style.setProperty('--spacing-sm', tokens.spacing.sm)
  root.style.setProperty('--spacing-md', tokens.spacing.md)
  root.style.setProperty('--spacing-lg', tokens.spacing.lg)
  root.style.setProperty('--spacing-xl', tokens.spacing.xl)
  root.style.setProperty('--spacing-2xl', tokens.spacing['2xl'])
}
