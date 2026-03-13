import type { FlexButton, Action } from '../../../../types/line'

const SPACING_OPTIONS = ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl']
const ACTION_TYPES = ['uri', 'message', 'postback'] as const

interface Props {
  button: FlexButton
  onChange: (button: FlexButton) => void
}

export default function ButtonProps({ button, onChange }: Props) {
  const update = (updates: Partial<FlexButton>) => onChange({ ...button, ...updates })

  const updateAction = (updates: Partial<Action>) => {
    update({ action: { ...button.action, ...updates } as Action })
  }

  const changeActionType = (newType: string) => {
    switch (newType) {
      case 'uri':
        update({ action: { type: 'uri', label: button.action?.label || '', uri: '' } })
        break
      case 'message':
        update({ action: { type: 'message', label: button.action?.label || '', text: '' } })
        break
      case 'postback':
        update({ action: { type: 'postback', label: button.action?.label || '', data: '' } })
        break
    }
  }

  return (
    <div className="space-y-2.5">
      <p className="text-xs font-bold text-orange-600">Button Properties</p>

      {/* Style */}
      <div>
        <label className="block text-[10px] text-gray-400 mb-0.5">Style</label>
        <div className="flex gap-1">
          {(['link', 'primary', 'secondary'] as const).map(s => (
            <button key={s} type="button" onClick={() => update({ style: s })}
              className={`flex-1 py-1 rounded text-[10px] font-medium ${(button.style || 'link') === s ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >{s}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Color</label>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded border border-gray-300 flex-shrink-0" style={{ backgroundColor: button.color || '#06C755' }} />
            <input className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs" value={button.color || ''} onChange={(e) => update({ color: e.target.value || undefined })} placeholder="#06C755" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Height</label>
          <div className="flex gap-1">
            {(['sm', 'md'] as const).map(h => (
              <button key={h} type="button" onClick={() => update({ height: h })}
                className={`flex-1 py-1 rounded text-[10px] font-medium ${(button.height || 'md') === h ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >{h}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Margin</label>
          <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={button.margin || ''} onChange={(e) => update({ margin: e.target.value || undefined })}>
            <option value="">-</option>
            {SPACING_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Flex</label>
          <input type="number" className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={button.flex ?? ''} onChange={(e) => update({ flex: e.target.value ? Number(e.target.value) : undefined })} />
        </div>
      </div>

      {/* Action */}
      <div className="border-t border-gray-200 pt-2">
        <p className="text-[10px] font-bold text-gray-500 mb-1.5">Action</p>

        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Type</label>
          <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={button.action?.type || 'uri'} onChange={(e) => changeActionType(e.target.value)}>
            {ACTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="mt-1.5">
          <label className="block text-[10px] text-gray-400 mb-0.5">Label</label>
          <input className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={button.action?.label || ''} onChange={(e) => updateAction({ label: e.target.value })} placeholder="Button label" />
        </div>

        {button.action?.type === 'uri' && (
          <div className="mt-1.5">
            <label className="block text-[10px] text-gray-400 mb-0.5">URI</label>
            <input className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={'uri' in button.action ? button.action.uri : ''} onChange={(e) => updateAction({ uri: e.target.value } as Partial<Action>)} placeholder="https://..." />
          </div>
        )}

        {button.action?.type === 'message' && (
          <div className="mt-1.5">
            <label className="block text-[10px] text-gray-400 mb-0.5">Text</label>
            <input className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={'text' in button.action ? button.action.text : ''} onChange={(e) => updateAction({ text: e.target.value } as Partial<Action>)} placeholder="Message text" />
          </div>
        )}

        {button.action?.type === 'postback' && (
          <>
            <div className="mt-1.5">
              <label className="block text-[10px] text-gray-400 mb-0.5">Data</label>
              <input className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={'data' in button.action ? button.action.data : ''} onChange={(e) => updateAction({ data: e.target.value } as Partial<Action>)} placeholder="postback data" />
            </div>
            <div className="mt-1.5">
              <label className="block text-[10px] text-gray-400 mb-0.5">Display Text</label>
              <input className="w-full border border-gray-300 rounded px-2 py-1 text-xs" value={'displayText' in button.action ? (button.action.displayText || '') : ''} onChange={(e) => updateAction({ displayText: e.target.value || undefined } as Partial<Action>)} placeholder="(optional)" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
