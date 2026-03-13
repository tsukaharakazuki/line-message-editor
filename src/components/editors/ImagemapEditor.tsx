import type { ImagemapMessage, ImagemapAction, ImagemapArea } from '../../types/line'
import { useRef, useState, useCallback } from 'react'

interface Props {
  message: ImagemapMessage
  onChange: (message: ImagemapMessage) => void
}

export default function ImagemapEditor({ message, onChange }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [imageError, setImageError] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  // Imagemap uses baseUrl + /1040 for the actual image
  const imageUrl = previewUrl || (message.baseUrl ? `${message.baseUrl}/1040` : '')

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
      }
      onChange({ ...message, actions: [...message.actions, newAction] })
    }
  }

  const updateAction = (index: number, patch: Partial<ImagemapAction>) => {
    const newActions = [...message.actions]
    newActions[index] = { ...newActions[index], ...patch } as ImagemapAction
    onChange({ ...message, actions: newActions })
  }

  const removeAction = (index: number) => {
    onChange({ ...message, actions: message.actions.filter((_, i) => i !== index) })
    if (editingIndex === index) setEditingIndex(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={message.baseUrl}
          onChange={(e) => { onChange({ ...message, baseUrl: e.target.value }); setImageError(false) }}
          placeholder="https://example.com/imagemap"
        />
        <p className="text-xs text-gray-400 mt-1">Image is loaded from Base URL + /1040</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preview Image URL (optional)</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={previewUrl}
          onChange={(e) => { setPreviewUrl(e.target.value); setImageError(false) }}
          placeholder="https://example.com/preview.jpg (direct image URL for preview)"
        />
        <p className="text-xs text-gray-400 mt-1">Use this if Base URL + /1040 doesn't load directly</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={message.altText}
          onChange={(e) => onChange({ ...message, altText: e.target.value })}
          placeholder="Image description"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={message.baseSize.width}
            onChange={(e) => onChange({ ...message, baseSize: { ...message.baseSize, width: Number(e.target.value) } })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={message.baseSize.height}
            onChange={(e) => onChange({ ...message, baseSize: { ...message.baseSize, height: Number(e.target.value) } })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tap Areas — drag on the canvas to create
        </label>
        <div
          ref={canvasRef}
          className="relative w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair select-none overflow-hidden"
          style={{ aspectRatio: `${message.baseSize.width} / ${message.baseSize.height}` }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {/* Background image preview */}
          {imageUrl && !imageError && (
            <img
              src={imageUrl}
              alt="Imagemap background"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              onError={() => setImageError(true)}
            />
          )}
          {message.actions.map((action, i) => {
            const scaleX = 100 / message.baseSize.width
            const scaleY = 100 / message.baseSize.height
            return (
              <div
                key={i}
                className={`absolute border-2 rounded cursor-pointer flex items-center justify-center text-white text-xs font-bold ${
                  editingIndex === i ? 'border-blue-500 bg-blue-500/30' : 'border-green-500 bg-green-500/30'
                }`}
                style={{
                  left: `${action.area.x * scaleX}%`,
                  top: `${action.area.y * scaleY}%`,
                  width: `${action.area.width * scaleX}%`,
                  height: `${action.area.height * scaleY}%`,
                }}
                onClick={(e) => { e.stopPropagation(); setEditingIndex(i) }}
              >
                {i + 1}
              </div>
            )
          })}
          {message.actions.length === 0 && !imageUrl && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
              Enter an image URL above, then drag to create tap areas
            </div>
          )}
          {message.actions.length === 0 && imageUrl && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-black/50 text-white text-xs px-3 py-1.5 rounded-lg">
                Drag to create tap areas
              </span>
            </div>
          )}
        </div>
      </div>

      {message.actions.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Actions</label>
          {message.actions.map((action, i) => (
            <div
              key={i}
              className={`border rounded-lg p-3 ${editingIndex === i ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}
              onClick={() => setEditingIndex(i)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">Area {i + 1}</span>
                <button type="button" onClick={() => removeAction(i)} className="text-red-500 text-xs hover:text-red-700">Remove</button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <select
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                  value={action.type}
                  onChange={(e) => {
                    if (e.target.value === 'uri') {
                      updateAction(i, { type: 'uri', linkUri: 'https://example.com' } as Partial<ImagemapAction>)
                    } else {
                      updateAction(i, { type: 'message', text: '' } as Partial<ImagemapAction>)
                    }
                  }}
                >
                  <option value="uri">URI</option>
                  <option value="message">Message</option>
                </select>
                {action.type === 'uri' && (
                  <input
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={action.linkUri}
                    onChange={(e) => updateAction(i, { linkUri: e.target.value } as Partial<ImagemapAction>)}
                    placeholder="https://..."
                  />
                )}
                {action.type === 'message' && (
                  <input
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={action.text}
                    onChange={(e) => updateAction(i, { text: e.target.value } as Partial<ImagemapAction>)}
                    placeholder="Message text"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
