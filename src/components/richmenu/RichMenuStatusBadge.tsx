import { Badge } from '../ui/Badge'
import type { SavedRichMenu } from '../../types/richmenu'

export default function RichMenuStatusBadge({ menu }: { menu: SavedRichMenu }) {
  const now = Date.now()
  const start = menu.deliveryStartAt ? Date.parse(menu.deliveryStartAt) : NaN
  const end = menu.deliveryEndAt ? Date.parse(menu.deliveryEndAt) : NaN
  const [label, className] = Number.isNaN(start) && Number.isNaN(end)
    ? ['下書き', 'bg-slate-100 text-slate-600']
    : !Number.isNaN(start) && now < start
      ? ['予約済み', 'bg-blue-50 text-blue-700']
      : !Number.isNaN(end) && now > end
        ? ['終了', 'bg-slate-100 text-slate-500']
        : ['配信中', 'bg-emerald-50 text-emerald-700']
  return <Badge className={className}>{label}</Badge>
}
