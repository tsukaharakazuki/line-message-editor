import type { LocationMessage } from '../../types/line'

interface Props {
  message: LocationMessage
  onChange: (message: LocationMessage) => void
}

export default function LocationEditor({ message, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={message.title}
          onChange={(e) => onChange({ ...message, title: e.target.value })}
          placeholder="Location name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={message.address}
          onChange={(e) => onChange({ ...message, address: e.target.value })}
          placeholder="Full address"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
          <input
            type="number"
            step="any"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={message.latitude}
            onChange={(e) => onChange({ ...message, latitude: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
          <input
            type="number"
            step="any"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={message.longitude}
            onChange={(e) => onChange({ ...message, longitude: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  )
}
