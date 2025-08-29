'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ExternalLink, Plus, X } from 'lucide-react'

interface TemplatePickerProps {
  selectedTemplates: string[]
  onTemplatesChange: (templates: string[]) => void
  referenceUrls: string[]
  onReferenceUrlsChange: (urls: string[]) => void
}

const templateOptions = [
  {
    id: 'Style A',
    name: 'Style A',
    description: 'Conversion-focused one-pager with clear CTAs and streamlined user flow',
    features: ['Hero with CTA', 'Services grid', 'Testimonials', 'Contact form'],
    preview: 'https://example.com/style-a'
  },
  {
    id: 'Style B',
    name: 'Style B',
    description: 'Editorial multi-page layout with rich content sections and storytelling',
    features: ['Multi-page navigation', 'Blog integration', 'Gallery showcase', 'About page'],
    preview: 'https://example.com/style-b'
  }
]

export default function TemplatePicker({
  selectedTemplates,
  onTemplatesChange,
  referenceUrls,
  onReferenceUrlsChange
}: TemplatePickerProps) {
  const [newUrl, setNewUrl] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<{
    name: string
    preview: string
  } | null>(null)

  const handleTemplateToggle = (templateId: string) => {
    if (selectedTemplates.includes(templateId)) {
      onTemplatesChange(selectedTemplates.filter(id => id !== templateId))
    } else if (selectedTemplates.length < 2) {
      onTemplatesChange([...selectedTemplates, templateId])
    }
  }

  const addReferenceUrl = () => {
    if (newUrl.trim() && referenceUrls.length < 2 && !referenceUrls.includes(newUrl.trim())) {
      onReferenceUrlsChange([...referenceUrls, newUrl.trim()])
      setNewUrl('')
    }
  }

  const removeReferenceUrl = (urlToRemove: string) => {
    onReferenceUrlsChange(referenceUrls.filter(url => url !== urlToRemove))
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="space-y-8">
      {/* Template Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Choose Your Design Style</h3>
        <p className="text-gray-600">Select up to 2 design styles that best fit your vision</p>
        
        <div className="grid gap-4 md:grid-cols-2">
          {templateOptions.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all ${
                selectedTemplates.includes(template.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleTemplateToggle(template.id)}
            >
              {selectedTemplates.includes(template.id) && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                <p className="text-gray-600 text-sm">{template.description}</p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Key Features:</p>
                  <ul className="space-y-1">
                    {template.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button
                  type="button"
                  className="text-primary hover:text-primary/80 text-sm font-medium flex items-center"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPreviewTemplate({ name: template.name, preview: template.preview })
                    setIsPreviewOpen(true)
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Preview Style
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {selectedTemplates.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            Please select at least one design style
          </p>
        )}
      </div>

      {/* Reference URLs */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Inspiration URLs (Optional)</h3>
        <p className="text-gray-600">Add up to 2 websites you like for inspiration</p>
        
        <div className="space-y-3">
          {referenceUrls.map((url, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 text-sm truncate flex-1"
              >
                {url}
              </a>
              <button
                type="button"
                onClick={() => removeReferenceUrl(url)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
          
          {referenceUrls.length < 2 && (
            <div className="flex space-x-2">
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addReferenceUrl()}
              />
              <button
                type="button"
                onClick={addReferenceUrl}
                disabled={!isValidUrl(newUrl)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </button>
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-500">
          Note: These URLs are for inspiration only. We'll create a unique design based on your preferences.
        </p>
      </div>
      
      {/* Preview Modal */}
      {isPreviewOpen && previewTemplate && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              setIsPreviewOpen(false)
              setPreviewTemplate(null)
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-[95vw] max-w-6xl h-[80vh] md:h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label={`Preview ${previewTemplate.name}`}
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
                <div className="min-w-0">
                  <p className="text-sm text-gray-500 truncate">Preview</p>
                  <h4 className="text-base font-semibold text-gray-900 truncate">{previewTemplate.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={previewTemplate.preview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Open in new tab
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPreviewOpen(false)
                      setPreviewTemplate(null)
                    }}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    aria-label="Close preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-white">
                {(() => {
                  try {
                    return (
                      <iframe
                        src={previewTemplate.preview}
                        title={previewTemplate.name}
                        className="w-full h-full border-0"
                      />
                    )
                  } catch {
                    const encodedUrl = encodeURIComponent(previewTemplate.preview)
                    const screenshotUrl = `https://image.thum.io/get/fullpage/${encodedUrl}`
                    return (
                      <div className="w-full h-full overflow-auto bg-white">
                        <div className="px-4 py-2 text-xs text-gray-500">
                          Live embedding is blocked by the site. Showing a scrollable snapshot instead.
                        </div>
                        <img
                          src={screenshotUrl}
                          alt={`${previewTemplate.name} snapshot`}
                          className="w-full h-auto"
                          loading="lazy"
                        />
                      </div>
                    )
                  }
                })()}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
