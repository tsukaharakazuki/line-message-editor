import type { TextMessage } from '../../types/line'

interface Props {
  message: TextMessage
  onChange: (message: TextMessage) => void
}

export default function TextEditor({ message, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-y min-h-[120px]"
          value={message.text}
          onChange={(e) => onChange({ ...message, text: e.target.value })}
          placeholder="Enter message text..."
          maxLength={5000}
        />
        <p className="text-xs text-gray-400 mt-1">{message.text.length} / 5000</p>
      </div>
    </div>
  )
}
