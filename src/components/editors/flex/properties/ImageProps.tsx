import type { FlexImage } from '../../../../types/line'

const SIZE_OPTIONS = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', '3xl', '4xl', '5xl', 'full']
const SPACING_OPTIONS = ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl']

interface Props {
  image: FlexImage
  onChange: (image: FlexImage) => void
}

export default function ImageProps({ image, onChange }: Props) {
  const update = (updates: Partial<FlexImage>) => onChange({ ...image, ...updates })

  return (
    <div className="space-y-2.5">
      <p className="text-xs font-bold text-green-600">Image Properties</p>

      <div>
        <label className="block text-[10px] text-gray-400 mb-0.5">URL</label>
        <div className="flex gap-2 items-start">
          <input
            className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs"
            value={image.url}
            onChange={(e) => update({ url: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
          {image.url && image.url.startsWith('http') && (
            <img
              src={image.url}
              alt=""
              className="w-10 h-10 object-cover rounded border border-gray-200 flex-shrink-0"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Size</label>
          <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={image.size || 'md'} onChange={(e) => update({ size: e.target.value })}>
            {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Aspect Mode</label>
          <div className="flex gap-1">
            {(['cover', 'fit'] as const).map(m => (
              <button key={m} type="button" onClick={() => update({ aspectMode: m })}
                className={`flex-1 py-1 rounded text-[10px] font-medium ${(image.aspectMode || 'cover') === m ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >{m}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Aspect Ratio</label>
          <input className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={image.aspectRatio || ''} onChange={(e) => update({ aspectRatio: e.target.value || undefined })} placeholder="20:13" />
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">BG Color</label>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded border border-gray-300 flex-shrink-0" style={{ backgroundColor: image.backgroundColor || 'transparent' }} />
            <input className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs" value={image.backgroundColor || ''} onChange={(e) => update({ backgroundColor: e.target.value || undefined })} placeholder="#FFF" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Margin</label>
          <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={image.margin || ''} onChange={(e) => update({ margin: e.target.value || undefined })}>
            <option value="">-</option>
            {SPACING_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Flex</label>
          <input type="number" className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={image.flex ?? ''} onChange={(e) => update({ flex: e.target.value ? Number(e.target.value) : undefined })} />
        </div>
      </div>
    </div>
  )
}
