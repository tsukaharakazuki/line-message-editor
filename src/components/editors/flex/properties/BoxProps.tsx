import type { FlexBox } from '../../../../types/line'

const SPACING_OPTIONS = ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl']
const LAYOUT_OPTIONS: FlexBox['layout'][] = ['vertical', 'horizontal', 'baseline']

interface Props {
  box: FlexBox
  onChange: (box: FlexBox) => void
}

function SelectField({ label, value, options, onChange }: { label: string; value?: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] text-gray-400 mb-0.5">{label}</label>
      <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={value || ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">-</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

export default function BoxProps({ box, onChange }: Props) {
  const update = (updates: Partial<FlexBox>) => onChange({ ...box, ...updates })

  return (
    <div className="space-y-2.5">
      <p className="text-xs font-bold text-purple-600">Box Properties</p>

      <div>
        <label className="block text-[10px] text-gray-400 mb-0.5">Layout</label>
        <div className="flex gap-1">
          {LAYOUT_OPTIONS.map(l => (
            <button key={l} type="button" onClick={() => update({ layout: l })}
              className={`flex-1 py-1 rounded text-[10px] font-medium ${box.layout === l ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >{l}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Spacing" value={box.spacing} options={SPACING_OPTIONS} onChange={(v) => update({ spacing: v || undefined })} />
        <SelectField label="Margin" value={box.margin} options={SPACING_OPTIONS} onChange={(v) => update({ margin: v || undefined })} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Flex</label>
          <input type="number" className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={box.flex ?? ''} onChange={(e) => update({ flex: e.target.value ? Number(e.target.value) : undefined })} />
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">BG Color</label>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded border border-gray-300 flex-shrink-0" style={{ backgroundColor: box.backgroundColor || 'transparent' }} />
            <input className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs" value={box.backgroundColor || ''} onChange={(e) => update({ backgroundColor: e.target.value || undefined })} placeholder="#FFF" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[10px] text-gray-400 mb-1">Padding</label>
        <div className="grid grid-cols-3 gap-1">
          <SelectField label="All" value={box.paddingAll} options={SPACING_OPTIONS} onChange={(v) => update({ paddingAll: v || undefined })} />
          <SelectField label="Top" value={box.paddingTop} options={SPACING_OPTIONS} onChange={(v) => update({ paddingTop: v || undefined })} />
          <SelectField label="Bottom" value={box.paddingBottom} options={SPACING_OPTIONS} onChange={(v) => update({ paddingBottom: v || undefined })} />
          <SelectField label="Start" value={box.paddingStart} options={SPACING_OPTIONS} onChange={(v) => update({ paddingStart: v || undefined })} />
          <SelectField label="End" value={box.paddingEnd} options={SPACING_OPTIONS} onChange={(v) => update({ paddingEnd: v || undefined })} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Justify" value={box.justifyContent} options={['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']} onChange={(v) => update({ justifyContent: v || undefined })} />
        <SelectField label="Align" value={box.alignItems} options={['flex-start', 'center', 'flex-end']} onChange={(v) => update({ alignItems: v || undefined })} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Corner Radius</label>
          <input className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={box.cornerRadius || ''} onChange={(e) => update({ cornerRadius: e.target.value || undefined })} placeholder="8px" />
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Border Color</label>
          <input className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={box.borderColor || ''} onChange={(e) => update({ borderColor: e.target.value || undefined })} placeholder="#DDD" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Width</label>
          <input className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={box.width || ''} onChange={(e) => update({ width: e.target.value || undefined })} placeholder="auto" />
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Height</label>
          <input className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={box.height || ''} onChange={(e) => update({ height: e.target.value || undefined })} placeholder="auto" />
        </div>
      </div>
    </div>
  )
}
