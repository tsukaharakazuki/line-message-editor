import type { FlexText } from '../../../../types/line'

const SIZE_OPTIONS = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', '3xl', '4xl', '5xl']
const SPACING_OPTIONS = ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl']

interface Props {
  text: FlexText
  onChange: (text: FlexText) => void
}

export default function TextProps({ text, onChange }: Props) {
  const update = (updates: Partial<FlexText>) => onChange({ ...text, ...updates })

  return (
    <div className="space-y-2.5">
      <p className="text-xs font-bold text-blue-600">Text Properties</p>

      <div>
        <label className="block text-[10px] text-gray-400 mb-0.5">Text</label>
        <textarea
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs resize-y min-h-[50px]"
          value={text.text}
          onChange={(e) => update({ text: e.target.value })}
          placeholder="Enter text..."
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Size</label>
          <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={text.size || 'md'} onChange={(e) => update({ size: e.target.value })}>
            {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Weight</label>
          <div className="flex gap-1">
            {(['regular', 'bold'] as const).map(w => (
              <button key={w} type="button" onClick={() => update({ weight: w })}
                className={`flex-1 py-1 rounded text-[10px] font-medium ${(text.weight || 'regular') === w ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >{w}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Color</label>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded border border-gray-300 flex-shrink-0" style={{ backgroundColor: text.color || '#111' }} />
            <input className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs" value={text.color || ''} onChange={(e) => update({ color: e.target.value || undefined })} placeholder="#111" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Align</label>
          <div className="flex gap-1">
            {(['start', 'center', 'end'] as const).map(a => (
              <button key={a} type="button" onClick={() => update({ align: a })}
                className={`flex-1 py-1 rounded text-[10px] font-medium ${text.align === a ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >{a}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Gravity</label>
          <div className="flex gap-1">
            {(['top', 'center', 'bottom'] as const).map(g => (
              <button key={g} type="button" onClick={() => update({ gravity: g })}
                className={`flex-1 py-1 rounded text-[10px] font-medium ${text.gravity === g ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >{g}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Decoration</label>
          <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={text.decoration || 'none'} onChange={(e) => update({ decoration: (e.target.value === 'none' ? undefined : e.target.value) as FlexText['decoration'] })}>
            <option value="none">none</option>
            <option value="underline">underline</option>
            <option value="line-through">line-through</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Wrap</label>
          <label className="flex items-center gap-1 text-xs">
            <input type="checkbox" checked={text.wrap || false} onChange={(e) => update({ wrap: e.target.checked || undefined })} />
            wrap
          </label>
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Max Lines</label>
          <input type="number" className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={text.maxLines ?? ''} onChange={(e) => update({ maxLines: e.target.value ? Number(e.target.value) : undefined })} />
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Flex</label>
          <input type="number" className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={text.flex ?? ''} onChange={(e) => update({ flex: e.target.value ? Number(e.target.value) : undefined })} />
        </div>
      </div>

      <div>
        <label className="block text-[10px] text-gray-400 mb-0.5">Margin</label>
        <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={text.margin || ''} onChange={(e) => update({ margin: e.target.value || undefined })}>
          <option value="">-</option>
          {SPACING_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  )
}
