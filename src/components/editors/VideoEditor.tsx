import type { VideoMessage } from '../../types/line'

interface Props {
  message: VideoMessage
  onChange: (message: VideoMessage) => void
}

export default function VideoEditor({ message, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={message.originalContentUrl}
          onChange={(e) => onChange({ ...message, originalContentUrl: e.target.value })}
          placeholder="https://example.com/video.mp4"
        />
        <p className="text-xs text-gray-400 mt-1">MP4, max 200MB</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preview Image URL</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={message.previewImageUrl}
          onChange={(e) => onChange({ ...message, previewImageUrl: e.target.value })}
          placeholder="https://example.com/video_preview.jpg"
        />
        <p className="text-xs text-gray-400 mt-1">JPEG or PNG, max 1MB</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tracking ID (optional)</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={message.trackingId || ''}
          onChange={(e) => onChange({ ...message, trackingId: e.target.value || undefined })}
          placeholder="tracking-id"
        />
      </div>
    </div>
  )
}
