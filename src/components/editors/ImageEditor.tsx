import type { ImageMessage } from '../../types/line'

interface Props {
  message: ImageMessage
  onChange: (message: ImageMessage) => void
}

export default function ImageEditor({ message, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Original Content URL</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={message.originalContentUrl}
          onChange={(e) => onChange({ ...message, originalContentUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
        <p className="text-xs text-gray-400 mt-1">JPEG or PNG, max 10MB</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preview Image URL</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={message.previewImageUrl}
          onChange={(e) => onChange({ ...message, previewImageUrl: e.target.value })}
          placeholder="https://example.com/image_preview.jpg"
        />
        <p className="text-xs text-gray-400 mt-1">JPEG or PNG, max 1MB</p>
      </div>
    </div>
  )
}
