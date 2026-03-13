import type { ImagemapMessage, ImagemapAction, ImagemapArea } from '../../types/line'
import { useRef, useState, useCallback } from 'react'

interface Props {
  message: ImagemapMessage
  onChange: (message: ImagemapMessage) => void
}

type GuidePattern = 'none' | 'v2' | 'h2' | 'grid4' | 'grid6' | 'grid9'

const GUIDE_PATTERNS: { value: GuidePattern; label: string; icon: string }[] = [
  { value: 'none', label: 'None', icon: '[ ]' },
  { value: 'v2', label: '2 Cols', icon: '||' },
  { value: 'h2', label: '2 Rows', icon: '=' },
  { value: 'grid4', label: '2x2', icon: '#+' },
  { value: 'grid6', label: '3x2', icon: '|||=' },
  { value: 'grid9', label: '3x3', icon: '###' },
]

function getGuideLines(pattern: GuidePattern): { vertical: number[]; horizontal: number[] } {
  switch (pattern) {
    case 'v2': return { vertical: [50], horizontal: [] }
    case 'h2': return { vertical: [], horizontal: [50] }
    case 'grid4': return { vertical: [50], horizontal: [50] }
    case 'grid6': return { vertical: [33.33, 66.67], horizontal: [50] }
    case 'grid9': return { vertical: [33.33, 66.67], horizontal: [33.33, 66.67] }
    default: return { vertical: [], horizontal: [] }
  }
}

function getSnapAreas(pattern: GuidePattern, w: number, h: number): ImagemapArea[] {
  switch (pattern) {
    case 'v2': return [
      { x: 0, y: 0, width: w / 2, height: h },
      { x: w / 2, y: 0, width: w / 2, height: h },
    ]
    case 'h2': return [
      { x: 0, y: 0, width: w, height: h / 2 },
      { x: 0, y: h / 2, width: w, height: h / 2 },
    ]
    case 'grid4': return [
      { x: 0, y: 0, width: w / 2, height: h / 2 },
      { x: w / 2, y: 0, width: w / 2, height: h / 2 },
      { x: 0, y: h / 2, width: w / 2, height: h / 2 },
      { x: w / 2, y: h / 2, width: w / 2, height: h / 2 },
    ]
    case 'grid6': {
      const cw = Math.round(w / 3)
      return [
        { x: 0, y: 0, width: cw, height: h / 2 },
        { x: cw, y: 0, width: cw, height: h / 2 },
        { x: cw * 2, y: 0, width: w - cw * 2, height: h / 2 },
        { x: 0, y: h / 2, width: cw, height: h / 2 },
        { x: cw, y: h / 2, width: cw, height: h / 2 },
        { x: cw * 2, y: h / 2, width: w - cw * 2, height: h / 2 },
      ]
    }
    case 'grid9': {
      const cw = Math.round(w / 3)
      const ch = Math.round(h / 3)
      return [
        { x: 0, y: 0, width: cw, height: ch },
        { x: cw, y: 0, width: cw, height: ch },
        { x: cw * 2, y: 0, width: w - cw * 2, height: ch },
        { x: 0, y: ch, width: cw, height: ch },
        { x: cw, y: ch, width: cw, height: ch },
        { x: cw * 2, y: ch, width: w - cw * 2, height: ch },
        { x: 0, y: ch * 2, width: cw, height: h - ch * 2 },
        { x: cw, y: ch * 2, width: cw, height: h - ch * 2 },
        { x: cw * 2, y: ch * 2, width: w - cw * 2, height: h - ch * 2 },
      ]
    }
    default: return []
  }
}

export default function ImagemapEditor({ message, onChange }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [imageError, setImageError] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [guide, setGuide] = useState<GuidePattern>('none')

  const displayImageUrl = imageUrl || (message.baseUrl ? `${message.baseUrl}/1040` : '')
  const guideLines = getGuideLines(guide)

  const applyGuide = (pattern: GuidePattern) => {
    setGuide(pattern)
    if (pattern === 'none') return
    const areas = getSnapAreas(pattern, message.baseSize.width, message.baseSize.height)
    if (areas.length === 0) return
    const actions: ImagemapAction[] = areas.map((area, i) => ({
      type: 'uri' as const,
      linkUri: 'https://example.com',
      area: { x: Math.round(area.x), y: Math.round(area.y), width: Math.round(area.width), height: Math.round(area.height) },
      label: `Area ${i + 1}`,
    }))
    onChange({ ...message, actions })
    setEditingIndex(0)
  }

  const getRelativePos = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    const scaleX = message.baseSize.width / rect.width
    const scaleY = message.baseSize.height / rect.height
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top) * scaleY),
    }
  }, [message.baseSize])

  const handleMouseDown = (e: React.MouseEvent) => {
    setDrawing(true)
    setStartPos(getRelativePos(e))
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!drawing) return
    setDrawing(false)
    const end = getRelativePos(e)
    const area: ImagemapArea = {
      x: Math.min(startPos.x, end.x),
      y: Math.min(startPos.y, end.y),
      width: Math.abs(end.x - startPos.x),
      height: Math.abs(end.y - startPos.y),
    }
    if (area.width > 10 && area.height > 10) {
      const newAction: ImagemapAction = {
        type: 'uri',
        linkUri: 'https://example.com',
        area,
        label: '',
      }
      const newIndex = message.actions.length
      onChange({ ...message, actions: [...message.actions, newAction] })
      setEditingIndex(newIndex)
    }
  }

  const updateAction = (index: number, updated: ImagemapAction) => {
    const newActions = [...message.actions]
    newActions[index] = updated
    onChange({ ...message, actions: newActions })
  }

  const changeActionType = (index: number, newType: 'uri' | 'message') => {
    const current = message.actions[index]
    if (newType === 'uri') {
      updateAction(index, { type: 'uri', linkUri: 'https://example.com', area: current.area, label: current.label || '' })
    } else {
      updateAction(index, { type: 'message', text: '', area: current.area, label: current.label || '' })
    }
  }

  const removeAction = (index: number) => {
    onChange({ ...message, actions: message.actions.filter((_, i) => i !== index) })
    if (editingIndex === index) setEditingIndex(null)
    else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1)
  }

  return (
    <div className="space-y-3">
      {/* Image URL */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <label className="block text-xs font-medium text-blue-800 mb-1">Image URL</label>
        <input
          className="w-full border border-blue-300 rounded px-2 py-1.5 text-sm bg-white"
          value={imageUrl}
          onChange={(e) => { setImageUrl(e.target.value); setImageError(false) }}
          placeholder="https://example.com/image.png"
        />
        {imageError && <p className="text-xs text-red-500 mt-1">Failed to load image.</p>}
      </div>

      {/* Base URL / Alt Text / Size - compact */}
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Base URL</label>
          <input
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
            value={message.baseUrl}
            onChange={(e) => { onChange({ ...message, baseUrl: e.target.value }); setImageError(false) }}
            placeholder="https://example.com/imagemap"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Alt Text</label>
          <input
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
            value={message.altText}
            onChange={(e) => onChange({ ...message, altText: e.target.value })}
            placeholder="Image description"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Width</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
            value={message.baseSize.width}
            onChange={(e) => onChange({ ...message, baseSize: { ...message.baseSize, width: Number(e.target.value) } })}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Height</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
            value={message.baseSize.height}
            onChange={(e) => onChange({ ...message, baseSize: { ...message.baseSize, height: Number(e.target.value) } })}
          />
        </div>
      </div>

      {/* Guide selector */}
      <div>
        <label className="text-xs font-medium text-gray-500 mb-1.5 block">Guide Lines (auto-creates tap areas)</label>
        <div className="flex gap-1">
          {GUIDE_PATTERNS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => applyGuide(p.value)}
              className={`flex-1 py-1.5 rounded text-[10px] font-medium transition-colors ${
                guide === p.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              title={p.label}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas - compact */}
      <div>
        <div
          ref={canvasRef}
          className="relative w-full bg-gray-100 border-2 border-gray-300 rounded-lg cursor-crosshair select-none overflow-hidden"
          style={{ aspectRatio: `${message.baseSize.width} / ${message.baseSize.height}`, maxHeight: '250px' }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {/* Background image */}
          {displayImageUrl && !imageError && (
            <img
              src={displayImageUrl}
              alt="Imagemap background"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              onError={() => setImageError(true)}
            />
          )}

          {/* Guide lines */}
          {guideLines.vertical.map((pos) => (
            <div
              key={`v-${pos}`}
              className="absolute top-0 bottom-0 border-l-2 border-dashed border-orange-400/70 pointer-events-none"
              style={{ left: `${pos}%` }}
            />
          ))}
          {guideLines.horizontal.map((pos) => (
            <div
              key={`h-${pos}`}
              className="absolute left-0 right-0 border-t-2 border-dashed border-orange-400/70 pointer-events-none"
              style={{ top: `${pos}%` }}
            />
          ))}

          {/* Tap area overlays */}
          {message.actions.map((action, i) => {
            const scaleX = 100 / message.baseSize.width
            const scaleY = 100 / message.baseSize.height
            const isSelected = editingIndex === i
            return (
              <div
                key={i}
                className={`absolute border-2 rounded cursor-pointer flex items-center justify-center text-xs font-bold transition-colors ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/40 text-white'
                    : 'border-green-500 bg-green-500/30 text-white'
                }`}
                style={{
                  left: `${action.area.x * scaleX}%`,
                  top: `${action.area.y * scaleY}%`,
                  width: `${action.area.width * scaleX}%`,
                  height: `${action.area.height * scaleY}%`,
                }}
                onClick={(e) => { e.stopPropagation(); setEditingIndex(i) }}
              >
                <span className="bg-black/60 px-1 py-0.5 rounded text-[9px] leading-none">
                  {i + 1}
                </span>
              </div>
            )
          })}

          {message.actions.length === 0 && !displayImageUrl && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
              Enter image URL, then drag to create areas
            </div>
          )}
          {message.actions.length === 0 && displayImageUrl && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-black/50 text-white text-[10px] px-2 py-1 rounded">
                Drag to create tap areas
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action list - compact accordion */}
      {message.actions.length > 0 && (
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-500">Actions ({message.actions.length})</label>
          {message.actions.map((action, i) => {
            const isSelected = editingIndex === i
            return (
              <div
                key={i}
                className={`border rounded-lg overflow-hidden transition-colors ${
                  isSelected ? 'border-blue-400 ring-1 ring-blue-200' : 'border-gray-200'
                }`}
              >
                {/* Header */}
                <div
                  className={`flex items-center justify-between px-2.5 py-1.5 cursor-pointer ${isSelected ? 'bg-blue-50' : 'bg-gray-50'}`}
                  onClick={() => setEditingIndex(isSelected ? null : i)}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${isSelected ? 'bg-blue-500' : 'bg-green-500'}`}>{i + 1}</span>
                    <span className="text-xs font-medium text-gray-700">{action.type === 'uri' ? 'URI' : 'Message'}</span>
                    {action.label && <span className="text-[10px] text-gray-400">({action.label})</span>}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeAction(i) }}
                    className="text-red-400 hover:text-red-600 text-[10px] font-medium"
                  >
                    Delete
                  </button>
                </div>

                {/* Detail */}
                {isSelected && (
                  <div className="p-2.5 space-y-2 bg-white">
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => changeActionType(i, 'uri')}
                        className={`flex-1 py-1.5 rounded text-xs font-medium ${action.type === 'uri' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                      >URI</button>
                      <button
                        type="button"
                        onClick={() => changeActionType(i, 'message')}
                        className={`flex-1 py-1.5 rounded text-xs font-medium ${action.type === 'message' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                      >Message</button>
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 mb-0.5">Label</label>
                      <input
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                        value={action.label || ''}
                        onChange={(e) => updateAction(i, { ...action, label: e.target.value || undefined } as ImagemapAction)}
                        placeholder="Optional label"
                      />
                    </div>

                    {action.type === 'uri' && (
                      <div>
                        <label className="block text-[10px] text-gray-400 mb-0.5">Link URI *</label>
                        <input
                          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                          value={action.linkUri}
                          onChange={(e) => updateAction(i, { ...action, linkUri: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>
                    )}

                    {action.type === 'message' && (
                      <div>
                        <label className="block text-[10px] text-gray-400 mb-0.5">Text *</label>
                        <textarea
                          className="w-full border border-gray-300 rounded px-2 py-1 text-xs resize-y min-h-[40px]"
                          value={action.text}
                          onChange={(e) => updateAction(i, { ...action, text: e.target.value })}
                          placeholder="Message text"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] text-gray-400 mb-0.5">Tap Area (px)</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(['x', 'y', 'width', 'height'] as const).map((field) => (
                          <div key={field}>
                            <label className="block text-[9px] text-gray-300 uppercase">{field}</label>
                            <input
                              type="number"
                              className="w-full border border-gray-300 rounded px-1.5 py-0.5 text-xs"
                              value={action.area[field]}
                              onChange={(e) => updateAction(i, { ...action, area: { ...action.area, [field]: Number(e.target.value) } })}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
