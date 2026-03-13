import type { StickerMessage } from '../../types/line'

interface Props {
  message: StickerMessage
  onChange: (message: StickerMessage) => void
}

const POPULAR_STICKERS = [
  { packageId: '446', stickerId: '1988', name: 'Brown' },
  { packageId: '446', stickerId: '1989', name: 'Brown Happy' },
  { packageId: '446', stickerId: '1990', name: 'Cony' },
  { packageId: '789', stickerId: '10855', name: 'Moon' },
  { packageId: '789', stickerId: '10856', name: 'James' },
  { packageId: '789', stickerId: '10857', name: 'Boss' },
  { packageId: '6136', stickerId: '10551376', name: 'Rabbit' },
  { packageId: '6136', stickerId: '10551377', name: 'Bear' },
  { packageId: '6325', stickerId: '10979904', name: 'Penguin' },
  { packageId: '6325', stickerId: '10979905', name: 'Cat' },
  { packageId: '11537', stickerId: '52002734', name: 'OK' },
  { packageId: '11537', stickerId: '52002735', name: 'Thank You' },
]

export default function StickerEditor({ message, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Package ID</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={message.packageId}
            onChange={(e) => onChange({ ...message, packageId: e.target.value })}
            placeholder="446"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sticker ID</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={message.stickerId}
            onChange={(e) => onChange({ ...message, stickerId: e.target.value })}
            placeholder="1988"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Quick Select</label>
        <div className="grid grid-cols-4 gap-2">
          {POPULAR_STICKERS.map((s) => (
            <button
              key={`${s.packageId}-${s.stickerId}`}
              type="button"
              onClick={() => onChange({ ...message, packageId: s.packageId, stickerId: s.stickerId })}
              className={`p-2 border rounded-lg text-xs text-center hover:border-green-400 transition-colors ${
                message.packageId === s.packageId && message.stickerId === s.stickerId
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">
        See{' '}
        <a
          href="https://developers.line.biz/en/docs/messaging-api/sticker-list/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Sticker list
        </a>{' '}
        for all available stickers.
      </p>
    </div>
  )
}
