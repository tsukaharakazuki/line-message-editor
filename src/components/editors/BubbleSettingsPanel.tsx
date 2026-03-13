import { useState } from 'react'
import type { FlexContainer, FlexBubble, FlexBubbleStyle, FlexBlockStyle } from '../../types/line'

interface Props {
  contents: FlexContainer
  onChange: (contents: FlexContainer) => void
}

const BUBBLE_SIZES: Array<{ value: FlexBubble['size']; label: string }> = [
  { value: 'nano', label: 'Nano' },
  { value: 'micro', label: 'Micro' },
  { value: 'kilo', label: 'Kilo' },
  { value: 'mega', label: 'Mega' },
  { value: 'giga', label: 'Giga' },
]

const SECTIONS = ['header', 'hero', 'body', 'footer'] as const

export default function BubbleSettingsPanel({ contents, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  if (contents.type !== 'bubble') {
    return null
  }

  const bubble = contents

  const updateBubble = (updates: Partial<FlexBubble>) => {
    onChange({ ...bubble, ...updates } as FlexContainer)
  }

  const updateStyle = (section: typeof SECTIONS[number], updates: Partial<FlexBlockStyle>) => {
    const styles: FlexBubbleStyle = { ...bubble.styles }
    styles[section] = { ...styles[section], ...updates }
    updateBubble({ styles })
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">Bubble Settings</span>
        <span className="text-xs text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="p-3 space-y-4">
          {/* Size */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Size</label>
            <div className="flex gap-1">
              {BUBBLE_SIZES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => updateBubble({ size: s.value })}
                  className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                    (bubble.size || 'mega') === s.value
                      ? 'bg-[#06C755] text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Direction */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Direction</label>
            <div className="flex gap-1">
              {(['ltr', 'rtl'] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => updateBubble({ direction: dir })}
                  className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                    (bubble.direction || 'ltr') === dir
                      ? 'bg-[#06C755] text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {dir.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Section Background Colors */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Section Colors</label>
            <div className="space-y-1.5">
              {SECTIONS.map((section) => (
                <div key={section} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-12 capitalize">{section}</span>
                  <div
                    className="w-6 h-6 rounded border border-gray-300 flex-shrink-0"
                    style={{
                      backgroundColor: bubble.styles?.[section]?.backgroundColor || 'transparent',
                      backgroundImage: !bubble.styles?.[section]?.backgroundColor
                        ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)'
                        : undefined,
                      backgroundSize: '6px 6px',
                      backgroundPosition: '0 0, 3px 3px',
                    }}
                  />
                  <input
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs"
                    value={bubble.styles?.[section]?.backgroundColor || ''}
                    onChange={(e) => updateStyle(section, { backgroundColor: e.target.value || undefined })}
                    placeholder="#FFFFFF"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
