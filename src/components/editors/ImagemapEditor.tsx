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
  const [imageUrl, setImageUrl] = useState('')

  // Display image: direct URL input, or fallback to baseUrl + /1040
  const displayImageUrl = imageUrl || (message.baseUrl ? `${message.baseUrl}/1040` : '')

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
      updateAction(index, {
        type: 'uri',
        linkUri: 'https://example.com',
        area: current.area,
        label: current.label || '',
      })
    } else {
      updateAction(index, {
        type: 'message',
        text: '',
        area: current.area,
        label: current.label || '',
      })
    }
  }

  const removeAction = (index: number) => {
    onChange({ ...message, actions: message.actions.filter((_, i) => i !== index) })
    if (editingIndex === index) setEditingIndex(null)
    else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1)
  }

  return (
    <div className="space-y-4">
      {/* Image URL */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-blue-800 mb-1">Image URL</label>
        <input
          className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm bg-white"
          value={imageUrl}
          onChange={(e) => { setImageUrl(e.target.value); setImageError(false) }}
          placeholder="https://example.com/image.png"
        />
        <p className="text-xs text-blue-500 mt-1">Enter the image URL to display in the preview. This is separate from Base URL used in the API.</p>
        {displayImageUrl && !imageError && (
          <div className="mt-2 rounded overflow-hidden border border-blue-200">
            <img
              src={displayImageUrl}
              alt="Preview"
              className="w-full max-h-[150px] object-contain bg-white"
              onError={() => setImageError(true)}
            />
          </div>
        )}
        {imageError && (
          <p className="text-xs text-red-500 mt-1">Failed to load image. Check the URL.</p>
        )}
      </div>

      {/* Base URL (for API) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={message.baseUrl}
          onChange={(e) => { onChange({ ...message, baseUrl: e.target.value }); setImageError(false) }}
          placeholder="https://example.com/imagemap"
        />
        <p className="text-xs text-gray-400 mt-1">LINE loads images from Base URL + /1040, /700, /460, etc.</p>
      </div>

      {/* Alt Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={message.altText}
          onChange={(e) => onChange({ ...message, altText: e.target.value })}
          placeholder="Image description"
        />
      </div>

      {/* Base Size */}
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

      {/* Canvas with tap area drawing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tap Areas — drag on the image to create
        </label>
        <div
          ref={canvasRef}
          className="relative w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair select-none overflow-hidden"
          style={{ aspectRatio: `${message.baseSize.width} / ${message.baseSize.height}` }}
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
                <span className="bg-black/60 px-1.5 py-0.5 rounded text-[10px]">
                  {i + 1}: {action.type === 'uri' ? 'URI' : 'MSG'}
                </span>
              </div>
            )
          })}

          {message.actions.length === 0 && !displayImageUrl && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
              Enter an image URL above, then drag to create tap areas
            </div>
          )}
          {message.actions.length === 0 && displayImageUrl && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-black/50 text-white text-xs px-3 py-1.5 rounded-lg">
                Drag to create tap areas
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action list */}
      {message.actions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Actions ({message.actions.length})</label>
          </div>

          {message.actions.map((action, i) => {
            const isSelected = editingIndex === i
            return (
              <div
                key={i}
                className={`border rounded-lg overflow-hidden transition-colors ${
                  isSelected ? 'border-blue-400 ring-1 ring-blue-200' : 'border-gray-200'
                }`}
              >
                {/* Action header */}
                <div
                  className={`flex items-center justify-between px-3 py-2 cursor-pointer ${
                    isSelected ? 'bg-blue-50' : 'bg-gray-50'
                  }`}
                  onClick={() => setEditingIndex(isSelected ? null : i)}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                      isSelected ? 'bg-blue-500' : 'bg-green-500'
                    }`}>{i + 1}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {action.type === 'uri' ? 'URI Action' : 'Message Action'}
                    </span>
                    {action.label && (
                      <span className="text-xs text-gray-400">({action.label})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">
                      {action.area.x},{action.area.y} {action.area.width}x{action.area.height}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeAction(i) }}
                      className="text-red-400 hover:text-red-600 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Action detail editor */}
                {isSelected && (
                  <div className="p-3 space-y-3 bg-white">
                    {/* Action Type */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Action Type</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => changeActionType(i, 'uri')}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                            action.type === 'uri'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          URI
                        </button>
                        <button
                          type="button"
                          onClick={() => changeActionType(i, 'message')}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                            action.type === 'message'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Message
                        </button>
                      </div>
                    </div>

                    {/* Label (common) */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Label (optional)</label>
                      <input
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                        value={action.label || ''}
                        onChange={(e) => updateAction(i, { ...action, label: e.target.value || undefined } as ImagemapAction)}
                        placeholder="Action label (for accessibility)"
                      />
                    </div>

                    {/* URI-specific fields */}
                    {action.type === 'uri' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Link URI *</label>
                        <input
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                          value={action.linkUri}
                          onChange={(e) => updateAction(i, { ...action, linkUri: e.target.value })}
                          placeholder="https://example.com or tel:09012345678"
                        />
                        <p className="text-xs text-gray-400 mt-1">https://, http://, tel:, mailto: supported</p>
                      </div>
                    )}

                    {/* Message-specific fields */}
                    {action.type === 'message' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Text *</label>
                        <textarea
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-y min-h-[60px]"
                          value={action.text}
                          onChange={(e) => updateAction(i, { ...action, text: e.target.value })}
                          placeholder="Message sent when area is tapped"
                        />
                      </div>
                    )}

                    {/* Area coordinates */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Tap Area (px)</label>
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <label className="block text-[10px] text-gray-400">X</label>
                          <input
                            type="number"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            value={action.area.x}
                            onChange={(e) => updateAction(i, { ...action, area: { ...action.area, x: Number(e.target.value) } })}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400">Y</label>
                          <input
                            type="number"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            value={action.area.y}
                            onChange={(e) => updateAction(i, { ...action, area: { ...action.area, y: Number(e.target.value) } })}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400">Width</label>
                          <input
                            type="number"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            value={action.area.width}
                            onChange={(e) => updateAction(i, { ...action, area: { ...action.area, width: Number(e.target.value) } })}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400">Height</label>
                          <input
                            type="number"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            value={action.area.height}
                            onChange={(e) => updateAction(i, { ...action, area: { ...action.area, height: Number(e.target.value) } })}
                          />
                        </div>
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
