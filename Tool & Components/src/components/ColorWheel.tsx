'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface ColorWheelProps {
  value: string
  onChange: (color: string) => void
  onPaletteChange: (palette: string[]) => void
  harmony?: HarmonyType
  onHarmonyChange?: (harmony: HarmonyType) => void
}

type HarmonyType = 'complementary' | 'analogous' | 'split' | 'triad' | 'tetrad' | 'mono' | 'mono-tints'

const harmonyTypes: { value: HarmonyType; label: string; description: string }[] = [
  { value: 'complementary', label: 'Complementary', description: 'Two colors opposite each other on the color wheel' },
  { value: 'analogous', label: 'Analogous', description: 'Three colors next to each other on the color wheel' },
  { value: 'split', label: 'Split', description: 'One base color plus two colors adjacent to its complement' },
  { value: 'triad', label: 'Triad', description: 'Three colors equally spaced around the color wheel' },
  { value: 'tetrad', label: 'Tetrad', description: 'Four colors forming a rectangle on the color wheel' },
  { value: 'mono', label: 'Monochrome', description: 'Variations of the same color with different saturation/lightness' },
  { value: 'mono-tints', label: 'Monochrome Tints', description: 'The same color with different lightness levels' }
]

export default function ColorWheel({ value, onChange, onPaletteChange, harmony, onHarmonyChange }: ColorWheelProps) {
  const [selectedHarmony, setSelectedHarmony] = useState<HarmonyType>(harmony || 'tetrad')
  const [palette, setPalette] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wheelRef = useRef<HTMLDivElement>(null)
  const [saturationPercent, setSaturationPercent] = useState<number>(100)
  const [lightnessPercent, setLightnessPercent] = useState<number>(50)
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true)

  useEffect(() => {
    generatePalette(value, selectedHarmony)
    drawColorWheel()
  }, [value, selectedHarmony])

  // Sync internal state when parent-controlled harmony changes
  useEffect(() => {
    if (harmony && harmony !== selectedHarmony) {
      setSelectedHarmony(harmony)
    }
  }, [harmony])

  // Force re-render of indicator during drag for smooth movement
  useEffect(() => {
    if (isDragging) {
      // This will trigger a re-render to update the indicator position
      const forceUpdate = () => {}
      forceUpdate()
    }
  }, [value, isDragging])

  const drawColorWheel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw color wheel
    for (let angle = 0; angle < 360; angle += 1) {
      const hue = angle
      const saturation = 100
      const lightness = 50

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, (angle - 1) * Math.PI / 180, angle * Math.PI / 180)
      ctx.closePath()

      const color = hslToHex(hue, saturation, lightness)
      ctx.fillStyle = color
      ctx.fill()
    }

    // Draw inner circle for saturation/brightness control
    const innerRadius = radius * 0.3
    ctx.beginPath()
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI)
    
    // Create gradient for inner circle
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, innerRadius)
    gradient.addColorStop(0, '#ffffff')
    gradient.addColorStop(0.7, '#f8f8f8')
    gradient.addColorStop(1, '#e0e0e0')
    
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 2
    ctx.stroke()
  }

  // Geometry helpers for stable pointer-based interactions
  const getGeometry = () => {
    if (!wheelRef.current) return null
    const rect = wheelRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const outerRadius = Math.min(centerX, centerY) - 10
    const innerRadius = outerRadius * 0.3
    const indicatorRadius = innerRadius + (outerRadius - innerRadius) * 0.65
    return { rect, centerX, centerY, outerRadius, innerRadius, indicatorRadius }
  }

  const updateFromPointer = (clientX: number, clientY: number) => {
    const g = getGeometry()
    if (!g) return
    const dx = clientX - g.rect.left - g.centerX
    const dy = clientY - g.rect.top - g.centerY
    let angle = Math.atan2(dy, dx)
    let hue = (angle * 180) / Math.PI
    let normalizedHue = (hue + 360) % 360
    if (snapEnabled) {
      const step = 15
      normalizedHue = Math.round(normalizedHue / step) * step
      angle = (normalizedHue * Math.PI) / 180
    }
    const newColor = hslToHex(normalizedHue, saturationPercent, lightnessPercent)
    setDragPosition({ x: g.indicatorRadius * Math.cos(angle), y: g.indicatorRadius * Math.sin(angle) })
    onChange(newColor)
  }

  const handleWheelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wheelRef.current) return

    const rect = wheelRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const clickX = e.clientX - rect.left - centerX
    const clickY = e.clientY - rect.top - centerY
    
    const distance = Math.sqrt(clickX * clickX + clickY * clickY)
    const maxRadius = Math.min(centerX, centerY) - 10
    
    if (distance <= maxRadius && distance > maxRadius * 0.3) {
      // Calculate hue from angle
      const angle = (Math.atan2(clickY, clickX) * 180 / Math.PI + 360) % 360
      const hue = angle
      const saturation = 100
      const lightness = 50
      
      const newColor = hslToHex(hue, saturation, lightness)
      onChange(newColor)
    }
  }

  const handleWheelDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    updateFromPointer(e.clientX, e.clientY)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    updateFromPointer(e.clientX, e.clientY)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragPosition(null)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setDragPosition(null)
  }

  const generatePalette = (color: string, harmonyType: HarmonyType) => {
    try {
      let colors: string[] = []
      
      switch (harmonyType) {
        case 'complementary':
          colors = generateComplementary(color)
          break
        case 'analogous':
          colors = generateAnalogous(color)
          break
        case 'split':
          colors = generateSplit(color)
          break
        case 'triad':
          colors = generateTriad(color)
          break
        case 'tetrad':
          colors = generateTetrad(color)
          break
        case 'mono':
          colors = generateMonochrome(color)
          break
        case 'mono-tints':
          colors = generateMonochromeTints(color)
          break
      }
      
      // Ensure we have the original color first
      if (!colors.includes(color)) {
        colors.unshift(color)
      }
      
      // Limit to 4 colors max for tetrad
      colors = colors.slice(0, 4)
      
      setPalette(colors)
      onPaletteChange(colors)
    } catch (error) {
      console.error('Error generating palette:', error)
      setPalette([color])
      onPaletteChange([color])
    }
  }

  const hexToHsl = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return [h * 360, s * 100, l * 100]
  }

  const hslToHex = (h: number, s: number, l: number): string => {
    h = h % 360
    s = Math.max(0, Math.min(100, s))
    l = Math.max(0, Math.min(100, l))

    const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = l / 100 - c / 2

    let r = 0, g = 0, b = 0

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c
    } else {
      r = c; g = 0; b = x
    }

    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0')
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0')
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0')

    return `#${rHex}${gHex}${bHex}`
  }

  const generateComplementary = (color: string): string[] => {
    const [h, s, l] = hexToHsl(color)
    const complementaryHue = (h + 180) % 360
    return [hslToHex(complementaryHue, s, l)]
  }

  const generateAnalogous = (color: string): string[] => {
    const [h, s, l] = hexToHsl(color)
    return [
      hslToHex((h + 30) % 360, s, l),
      hslToHex((h - 30 + 360) % 360, s, l)
    ]
  }

  const generateSplit = (color: string): string[] => {
    const [h, s, l] = hexToHsl(color)
    return [
      hslToHex((h + 150) % 360, s, l),
      hslToHex((h + 210) % 360, s, l)
    ]
  }

  const generateTriad = (color: string): string[] => {
    const [h, s, l] = hexToHsl(color)
    return [
      hslToHex((h + 120) % 360, s, l),
      hslToHex((h + 240) % 360, s, l)
    ]
  }

  const generateTetrad = (color: string): string[] => {
    const [h, s, l] = hexToHsl(color)
    return [
      hslToHex((h + 90) % 360, s, l),
      hslToHex((h + 180) % 360, s, l),
      hslToHex((h + 270) % 360, s, l)
    ]
  }

  const generateMonochrome = (color: string): string[] => {
    const [h, s, l] = hexToHsl(color)
    return [
      hslToHex(h, Math.max(0, s - 20), Math.max(0, l - 20)),
      hslToHex(h, Math.min(100, s + 20), Math.min(100, l + 20))
    ]
  }

  const generateMonochromeTints = (color: string): string[] => {
    const [h, s, l] = hexToHsl(color)
    return [
      hslToHex(h, s, Math.max(0, l - 30)),
      hslToHex(h, s, Math.min(100, l + 30))
    ]
  }

  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy color:', error)
    }
  }

  const exportPalette = () => {
    const paletteData = {
      name: 'Custom Palette',
      colors: palette,
      harmony: selectedHarmony,
      baseColor: value,
      exportDate: new Date().toISOString()
    }

    const dataStr = JSON.stringify(paletteData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `color-palette-${Date.now()}.json`
    link.click()
  }

  const exportCSSVariables = () => {
    const cssContent = `/* Color Palette CSS Variables */
:root {
${palette.map((color, index) => `  --color-${index + 1}: ${color};`).join('\n')}
}

/* Usage examples */
.color-primary { color: var(--color-1); }
.color-secondary { color: var(--color-2); }
.color-accent { color: var(--color-3); }
.color-neutral { color: var(--color-4); }`

    const dataBlob = new Blob([cssContent], { type: 'text/css' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `color-palette-${Date.now()}.css`
    link.click()
  }

  const exportTailwindConfig = () => {
    const tailwindContent = `// Tailwind CSS Color Configuration
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${palette[0] || value}',
        secondary: '${palette[1] || ''}',
        accent: '${palette[2] || ''}',
        neutral: '${palette[3] || ''}',
      }
    }
  }
}`

    const dataBlob = new Blob([tailwindContent], { type: 'text/javascript' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `tailwind-colors-${Date.now()}.js`
    link.click()
  }

  const getHarmonyOffsets = (type: HarmonyType): number[] => {
    switch (type) {
      case 'complementary':
        return [0, 180]
      case 'analogous':
        return [0, 30, 330]
      case 'split':
        return [0, 150, 210]
      case 'triad':
        return [0, 120, 240]
      case 'tetrad':
        return [0, 90, 180, 270]
      case 'mono':
      case 'mono-tints':
      default:
        return [0]
    }
  }

  return (
    <div className="space-y-8">
      {/* Pick a color section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Pick a color</h3>
        
        {/* Color Wheel */}
        <div className="flex justify-center">
          <div 
            ref={wheelRef}
            className="relative cursor-pointer select-none group"
            onClick={handleWheelClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleWheelDrag}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <canvas
              ref={canvasRef}
              width={200}
              height={200}
              className="rounded-full border-2 border-gray-200 shadow-lg transition-shadow duration-200 group-hover:shadow-xl"
            />
            
            {/* Selected color indicator */}
            {(() => {
              const size = wheelRef.current?.clientWidth ?? 200
              const center = size / 2
              const outerRadius = center - 10
              const innerRadius = outerRadius * 0.3
              const indicatorRadius = innerRadius + (outerRadius - innerRadius) * 0.65
              const [baseHue] = hexToHsl(value)
              const offsets = getHarmonyOffsets(selectedHarmony)
              return (
                <>
                  {offsets.map((off, idx) => {
                    const hue = (baseHue + off) % 360
                    const angle = (hue * Math.PI) / 180
                    const x = indicatorRadius * Math.cos(angle)
                    const y = indicatorRadius * Math.sin(angle)
                    const color = hslToHex(hue, 100, 50)
                    const isBase = idx === 0
                    return (
                      <div
                        key={idx}
                        onMouseDown={(e) => {
                          // Start drag from this handle
                          setIsDragging(true)
                          updateFromPointer(e.clientX, e.clientY)
                          e.stopPropagation()
                        }}
                        className={`absolute rounded-full border-2 shadow-lg pointer-events-auto ${isBase ? 'w-4 h-4 border-gray-800 bg-white' : 'w-3 h-3 border-white'}`}
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(${x}px, ${y}px)`,
                          backgroundColor: isBase ? undefined : color,
                        }}
                        title={color}
                      />
                    )
                  })}
                </>
              )
            })()}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 rounded-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </div>
        </div>

        {/* Selected color display */}
        <div className="flex justify-center items-center space-x-3">
          <div 
            className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm"
            style={{ backgroundColor: value }}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="font-mono text-sm px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="#000000"
          />
        </div>
        
        {/* Saturation & Lightness controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-700">Saturation: {saturationPercent}%</label>
            <input
              type="range"
              min={0}
              max={100}
              value={saturationPercent}
              onChange={(e) => {
                const s = Number(e.target.value)
                setSaturationPercent(s)
                const [h] = hexToHsl(value)
                onChange(hslToHex(h, s, lightnessPercent))
              }}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Lightness: {lightnessPercent}%</label>
            <input
              type="range"
              min={0}
              max={100}
              value={lightnessPercent}
              onChange={(e) => {
                const l = Number(e.target.value)
                setLightnessPercent(l)
                const [h] = hexToHsl(value)
                onChange(hslToHex(h, saturationPercent, l))
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Choose a color combination section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Choose a color combination</h3>
        
        {/* Harmony selector */}
        <div className="w-full max-w-xs space-y-2">
          <select
            value={selectedHarmony}
            onChange={(e) => {
              const next = e.target.value as HarmonyType
              setSelectedHarmony(next)
              onHarmonyChange?.(next)
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            {harmonyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={snapEnabled}
                onChange={(e) => setSnapEnabled(e.target.checked)}
              />
              Snap 15°
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const [h] = hexToHsl(value)
                  const step = 15
                  const nh = (h - step + 360) % 360
                  onChange(hslToHex(nh, saturationPercent, lightnessPercent))
                }}
                className="px-2 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
              >
                ⟲ Rotate
              </button>
              <button
                type="button"
                onClick={() => {
                  const [h] = hexToHsl(value)
                  const step = 15
                  const nh = (h + step) % 360
                  onChange(hslToHex(nh, saturationPercent, lightnessPercent))
                }}
                className="px-2 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
              >
                Rotate ⟳
              </button>
            </div>
          </div>
          
          {/* Harmony description */}
          <p className="text-sm text-gray-600 italic">
            {harmonyTypes.find(t => t.value === selectedHarmony)?.description}
          </p>
        </div>

        {/* Generated palette */}
        <div className="space-y-4">
          <div className="flex space-x-3">
            {palette.map((color, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-16 h-16 rounded-lg border-2 border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => copyToClipboard(color)}
                  title={`Click to copy ${color}`}
                />
                <p className="text-xs font-mono text-gray-600 mt-2">{color}</p>
              </div>
            ))}
          </div>
          
          {/* Color preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: palette[0] || value }} />
                <span className="text-sm text-gray-600">Primary text</span>
                <span className="text-sm font-medium" style={{ color: palette[0] || value }}>
                  This is how your primary color looks
                </span>
              </div>
              {palette[1] && (
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: palette[1] }} />
                  <span className="text-sm text-gray-600">Secondary text</span>
                  <span className="text-sm font-medium" style={{ color: palette[1] }}>
                    Secondary color example
                  </span>
                </div>
              )}
              {palette[2] && (
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: palette[2] }} />
                  <span className="text-sm text-gray-600">Accent text</span>
                  <span className="text-sm font-medium" style={{ color: palette[2] }}>
                    Accent color example
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Use this color combination section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Use this color combination</h3>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportPalette}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
          >
            Export JSON
          </button>
          <button
            onClick={exportCSSVariables}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Export CSS
          </button>
          <button
            onClick={exportTailwindConfig}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium text-sm"
          >
            Export Tailwind
          </button>
          <button
            onClick={() => {
              // Export currently selected color to brand input via onChange already handled; this button randomizes within current harmony
              const options = palette.length ? palette : [value]
              const choice = options[Math.floor(Math.random() * options.length)]
              onChange(choice)
            }}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
          >
            Random from palette
          </button>
        </div>
      </div>
    </div>
  )
}
