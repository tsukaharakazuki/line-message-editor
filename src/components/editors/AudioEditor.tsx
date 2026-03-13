import type { AudioMessage } from '../../types/line'

interface Props {
  message: AudioMessage
  onChange: (message: AudioMessage) => void
}

export default function AudioEditor({ message, onChange }: Props) {
  const durationSec = Math.floor(message.duration / 1000)
  const minutes = Math.floor(durationSec / 60)
  const seconds = durationSec % 60

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Audio URL</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={message.originalContentUrl}
          onChange={(e) => onChange({ ...message, originalContentUrl: e.target.value })}
          placeholder="https://example.com/audio.m4a"
        />
        <p className="text-xs text-gray-400 mt-1">M4A, max 200MB</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Duration: {minutes}m {seconds}s ({message.duration}ms)
        </label>
        <input
          type="range"
          className="w-full"
          min={1000}
          max={600000}
          step={1000}
          value={message.duration}
          onChange={(e) => onChange({ ...message, duration: Number(e.target.value) })}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>1s</span>
          <span>10min</span>
        </div>
      </div>
    </div>
  )
}
