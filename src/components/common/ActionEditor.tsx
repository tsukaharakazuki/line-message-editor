import { useState } from 'react'
import type { Action } from '../../types/line'

interface Props {
  action: Action
  onChange: (action: Action) => void
  label?: string
}

const ACTION_TYPES = [
  { value: 'uri', label: 'URI' },
  { value: 'message', label: 'Message' },
  { value: 'postback', label: 'Postback' },
  { value: 'datetimepicker', label: 'Datetime Picker' },
  { value: 'camera', label: 'Camera' },
  { value: 'cameraRoll', label: 'Camera Roll' },
  { value: 'location', label: 'Location' },
  { value: 'richmenuswitch', label: 'Rich Menu Switch' },
] as const

function createDefaultAction(type: string): Action {
  switch (type) {
    case 'uri': return { type: 'uri', label: '', uri: 'https://example.com' }
    case 'message': return { type: 'message', label: '', text: '' }
    case 'postback': return { type: 'postback', label: '', data: '' }
    case 'datetimepicker': return { type: 'datetimepicker', label: '', data: '', mode: 'date' }
    case 'camera': return { type: 'camera', label: '' }
    case 'cameraRoll': return { type: 'cameraRoll', label: '' }
    case 'location': return { type: 'location', label: '' }
    case 'richmenuswitch': return { type: 'richmenuswitch', label: '', richMenuAliasId: '', data: '' }
    default: return { type: 'message', label: '', text: '' }
  }
}

export default function ActionEditor({ action, onChange, label }: Props) {
  const [isOpen, setIsOpen] = useState(true)

  const handleTypeChange = (newType: string) => {
    onChange(createDefaultAction(newType))
  }

  const update = (patch: Partial<Action>) => {
    onChange({ ...action, ...patch } as Action)
  }

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
      <button
        type="button"
        className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{label || 'Action'}</span>
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              value={action.type}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              {ACTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {'label' in action && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Label</label>
              <input
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                value={action.label || ''}
                onChange={(e) => update({ label: e.target.value })}
                placeholder="Button label"
              />
            </div>
          )}

          {action.type === 'uri' && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">URI</label>
              <input
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                value={action.uri}
                onChange={(e) => update({ uri: e.target.value } as Partial<Action>)}
                placeholder="https://example.com"
              />
            </div>
          )}

          {action.type === 'message' && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Text</label>
              <input
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                value={action.text}
                onChange={(e) => update({ text: e.target.value } as Partial<Action>)}
                placeholder="Message text"
              />
            </div>
          )}

          {action.type === 'postback' && (
            <>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Data</label>
                <input
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                  value={action.data}
                  onChange={(e) => update({ data: e.target.value } as Partial<Action>)}
                  placeholder="action=buy&itemid=123"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Display Text</label>
                <input
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                  value={action.displayText || ''}
                  onChange={(e) => update({ displayText: e.target.value } as Partial<Action>)}
                  placeholder="Optional display text"
                />
              </div>
            </>
          )}

          {action.type === 'datetimepicker' && (
            <>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Data</label>
                <input
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                  value={action.data}
                  onChange={(e) => update({ data: e.target.value } as Partial<Action>)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Mode</label>
                <select
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                  value={action.mode}
                  onChange={(e) => update({ mode: e.target.value } as Partial<Action>)}
                >
                  <option value="date">Date</option>
                  <option value="time">Time</option>
                  <option value="datetime">Datetime</option>
                </select>
              </div>
            </>
          )}

          {action.type === 'richmenuswitch' && (
            <>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Rich Menu Alias ID</label>
                <input
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                  value={action.richMenuAliasId}
                  onChange={(e) => update({ richMenuAliasId: e.target.value } as Partial<Action>)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Data</label>
                <input
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                  value={action.data}
                  onChange={(e) => update({ data: e.target.value } as Partial<Action>)}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
