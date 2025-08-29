import { render, screen } from '@testing-library/react'
import React from 'react'

jest.mock('@/components/MagicBento/MagicBento.jsx', () => ({
  __esModule: true,
  default: () => <div data-testid="magic-bento" />
}))

jest.mock('@/components/ScrollStack/ScrollStack.jsx', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-stack">{children}</div>
  ),
  ScrollStackItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-stack-item">{children}</div>
  )
}))

jest.mock('@/components/ChromaGrid/ChromaGrid.jsx', () => ({
  __esModule: true,
  default: () => <div data-testid="chroma-grid" />
}))

jest.mock('@/components/LayoutPicker', () => ({
  __esModule: true,
  default: () => <div data-testid="layout-picker" />
}))

import Features from '@/components/Features'

describe('Features component', () => {
  it('renders the main heading and description', () => {
    render(<Features />)

    // Default heading
    expect(
      screen.getByRole('heading', { name: /why choose our web design services\?/i })
    ).toBeInTheDocument()

    // Description
    expect(
      screen.getByText(/we combine creativity with technical expertise/i)
    ).toBeInTheDocument()
  })

  it('renders all feature cards in grid layout by default', () => {
    render(<Features />)

    // Check that all feature titles are present
    expect(screen.getByText(/custom design/i)).toBeInTheDocument()
    expect(screen.getByText(/mobile-first/i)).toBeInTheDocument()
    expect(screen.getByText(/fast performance/i)).toBeInTheDocument()
    expect(screen.getByText(/conversion focused/i)).toBeInTheDocument()
    expect(screen.getByText(/user experience/i)).toBeInTheDocument()
    expect(screen.getByText(/seo optimized/i)).toBeInTheDocument()
  })

  it('renders the call-to-action section', () => {
    render(<Features />)

    expect(
      screen.getByText(/ready to transform your online presence\?/i)
    ).toBeInTheDocument()
    
    expect(
      screen.getByText(/start your project/i)
    ).toBeInTheDocument()
  })
})


