import type { FlexIcon, FlexSeparator, FlexFiller, FlexComponent } from '../../../../types/line'

const SPACING_OPTIONS = ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl']
const SIZE_OPTIONS = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', '3xl', '4xl', '5xl']

interface Props {
  component: FlexIcon | FlexSeparator | FlexFiller
  onChange: (component: FlexComponent) => void
}

function IconProps({ icon, onChange }: { icon: FlexIcon; onChange: (icon: FlexIcon) => void }) {
  const update = (updates: Partial<FlexIcon>) => onChange({ ...icon, ...updates })
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-bold text-yellow-600">Icon Properties</p>
      <div>
        <label className="block text-[10px] text-gray-400 mb-0.5">URL</label>
        <div className="flex gap-2 items-center">
          <input className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs" value={icon.url} onChange={(e) => update({ url: e.target.value })} placeholder="https://..." />
          {icon.url && icon.url.startsWith('http') && (
            <img src={icon.url} alt="" className="w-5 h-5 flex-shrink-0" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Size</label>
          <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={icon.size || 'md'} onChange={(e) => update({ size: e.target.value })}>
            {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Margin</label>
          <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={icon.margin || ''} onChange={(e) => update({ margin: e.target.value || undefined })}>
            <option value="">-</option>
            {SPACING_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-[10px] text-gray-400 mb-0.5">Aspect Ratio</label>
        <input className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={icon.aspectRatio || ''} onChange={(e) => update({ aspectRatio: e.target.value || undefined })} placeholder="1:1" />
      </div>
    </div>
  )
}

function SeparatorProps({ separator, onChange }: { separator: FlexSeparator; onChange: (s: FlexSeparator) => void }) {
  const update = (updates: Partial<FlexSeparator>) => onChange({ ...separator, ...updates })
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-bold text-gray-500">Separator Properties</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Color</label>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded border border-gray-300 flex-shrink-0" style={{ backgroundColor: separator.color || '#DDD' }} />
            <input className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs" value={separator.color || ''} onChange={(e) => update({ color: e.target.value || undefined })} placeholder="#DDD" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Margin</label>
          <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={separator.margin || ''} onChange={(e) => update({ margin: e.target.value || undefined })}>
            <option value="">-</option>
            {SPACING_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}

function FillerProps({ filler, onChange }: { filler: FlexFiller; onChange: (f: FlexFiller) => void }) {
  const update = (updates: Partial<FlexFiller>) => onChange({ ...filler, ...updates })
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-bold text-gray-500">Filler Properties</p>
      <div>
        <label className="block text-[10px] text-gray-400 mb-0.5">Flex</label>
        <input type="number" className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={filler.flex ?? ''} onChange={(e) => update({ flex: e.target.value ? Number(e.target.value) : undefined })} />
      </div>
    </div>
  )
}

export default function SimpleProps({ component, onChange }: Props) {
  switch (component.type) {
    case 'icon':
      return <IconProps icon={component} onChange={(v) => onChange(v)} />
    case 'separator':
      return <SeparatorProps separator={component} onChange={(v) => onChange(v)} />
    case 'filler':
      return <FillerProps filler={component} onChange={(v) => onChange(v)} />
    default:
      return null
  }
}
