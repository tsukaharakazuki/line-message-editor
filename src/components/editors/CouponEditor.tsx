import type { CouponMessage } from '../../types/line'

interface Props {
  message: CouponMessage
  onChange: (message: CouponMessage) => void
}

export default function CouponEditor({ message, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Coupon ID</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
          value={message.couponId}
          onChange={(e) => onChange({ ...message, couponId: e.target.value })}
          placeholder="01JYNW8JMQVFBNWF1APF8Z3FS7"
        />
        <p className="text-xs text-gray-400 mt-1">LINE Official Account Manager で作成したクーポンの ID</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Delivery Tag
          <span className="text-gray-400 font-normal ml-1">(optional)</span>
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={message.deliveryTag || ''}
          onChange={(e) => onChange({ ...message, deliveryTag: e.target.value || undefined })}
          placeholder="2025_winter_campaign"
        />
        <p className="text-xs text-gray-400 mt-1">配信タグ（トラッキング用）</p>
      </div>
    </div>
  )
}
