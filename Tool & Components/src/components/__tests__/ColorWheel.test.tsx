import { render, screen, fireEvent } from '@testing-library/react'
import ColorWheel from '../ColorWheel'

describe('ColorWheel', () => {
  const mockOnChange = jest.fn()
  const mockOnPaletteChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the color picker', () => {
    render(
      <ColorWheel
        value="#3B82F6"
        onChange={mockOnChange}
        onPaletteChange={mockOnPaletteChange}
      />
    )

    expect(screen.getByPlaceholderText('#000000')).toBeInTheDocument()
  })

  it('displays the selected color value', () => {
    render(
      <ColorWheel
        value="#3B82F6"
        onChange={mockOnChange}
        onPaletteChange={mockOnPaletteChange}
      />
    )

    expect(screen.getByDisplayValue('#3B82F6')).toBeInTheDocument()
  })

  it('calls onChange when color is changed', () => {
    render(
      <ColorWheel
        value="#3B82F6"
        onChange={mockOnChange}
        onPaletteChange={mockOnPaletteChange}
      />
    )

    const colorPicker = screen.getByPlaceholderText('#000000')
    fireEvent.change(colorPicker, { target: { value: '#EF4444' } })

    expect(mockOnChange).toHaveBeenCalledWith('#EF4444')
  })

  it('renders harmony type buttons', () => {
    render(
      <ColorWheel
        value="#3B82F6"
        onChange={mockOnChange}
        onPaletteChange={mockOnPaletteChange}
      />
    )

    expect(screen.getByText('Complementary')).toBeInTheDocument()
    expect(screen.getByText('Analogous')).toBeInTheDocument()
    expect(screen.getByText('Triad')).toBeInTheDocument()
  })

  it('displays the generated palette section', () => {
    render(
      <ColorWheel
        value="#3B82F6"
        onChange={mockOnChange}
        onPaletteChange={mockOnPaletteChange}
      />
    )

    expect(screen.getByText('#3B82F6')).toBeInTheDocument()
  })
})
