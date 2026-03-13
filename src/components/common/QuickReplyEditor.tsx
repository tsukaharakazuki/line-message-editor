import type { QuickReply, QuickReplyItem, Action } from '../../types/line'
import ActionEditor from './ActionEditor'

interface Props {
  quickReply?: QuickReply
  onChange: (quickReply?: QuickReply) => void
}

function createDefaultItem(): QuickReplyItem {
  return {
    type: 'action',
    action: { type: 'message', label: 'Quick Reply', text: 'quick' },
  }
}

export default function QuickReplyEditor({ quickReply, onChange }: Props) {
  const enabled = !!quickReply
  const items = quickReply?.items || []

  const toggleEnabled = () => {
    if (enabled) {
      onChange(undefined)
    } else {
      onChange({ items: [createDefaultItem()] })
    }
  }

  const updateItem = (index: number, patch: Partial<QuickReplyItem>) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], ...patch }
    onChange({ items: newItems })
  }

  const addItem = () => {
    onChange({ items: [...items, createDefaultItem()] })
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onChange(newItems.length > 0 ? { items: newItems } : undefined)
  }

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Quick Reply</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={enabled}
            onChange={toggleEnabled}
            className="rounded"
          />
          Enable
        </label>
      </div>

      {enabled && (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">Item {i + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="text-red-500 text-xs hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="mb-2">
                <label className="block text-xs text-gray-500 mb-1">Image URL (optional)</label>
                <input
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                  value={item.imageUrl || ''}
                  onChange={(e) => updateItem(i, { imageUrl: e.target.value || undefined })}
                  placeholder="https://example.com/icon.png"
                />
              </div>
              <ActionEditor
                action={item.action}
                onChange={(action: Action) => updateItem(i, { action })}
                label={`Action`}
              />
            </div>
          ))}
          {items.length < 13 && (
            <button
              type="button"
              onClick={addItem}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-green-400 hover:text-green-600"
            >
              + Add Quick Reply Item
            </button>
          )}
        </div>
      )}
    </div>
  )
}
