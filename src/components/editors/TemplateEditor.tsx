import type {
  TemplateMessage,
  Template,
  ButtonsTemplate,
  ConfirmTemplate,
  CarouselTemplate,
  ImageCarouselTemplate,
  Action,
  CarouselColumn,
  ImageCarouselColumn,
  TemplateType,
  TEMPLATE_TYPE_LABELS as _TL,
} from '../../types/line'
import { TEMPLATE_TYPE_LABELS } from '../../types/line'
import ActionEditor from '../common/ActionEditor'

interface Props {
  message: TemplateMessage
  onChange: (message: TemplateMessage) => void
}

function defaultTemplate(type: TemplateType): Template {
  switch (type) {
    case 'buttons':
      return { type: 'buttons', text: 'Please select', actions: [{ type: 'message', label: 'Option 1', text: 'option1' }] }
    case 'confirm':
      return { type: 'confirm', text: 'Are you sure?', actions: [{ type: 'message', label: 'Yes', text: 'yes' }, { type: 'message', label: 'No', text: 'no' }] }
    case 'carousel':
      return { type: 'carousel', columns: [{ text: 'Column 1', actions: [{ type: 'message', label: 'Select', text: 'col1' }] }] }
    case 'image_carousel':
      return { type: 'image_carousel', columns: [{ imageUrl: 'https://example.com/image.jpg', action: { type: 'uri', label: 'View', uri: 'https://example.com' } }] }
  }
}

function ButtonsEditor({ template, onChange }: { template: ButtonsTemplate; onChange: (t: ButtonsTemplate) => void }) {
  const updateAction = (i: number, action: Action) => {
    const newActions = [...template.actions]
    newActions[i] = action
    onChange({ ...template, actions: newActions })
  }
  const addAction = () => onChange({ ...template, actions: [...template.actions, { type: 'message', label: `Option ${template.actions.length + 1}`, text: '' }] })
  const removeAction = (i: number) => onChange({ ...template, actions: template.actions.filter((_, idx) => idx !== i) })

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Thumbnail Image URL</label>
        <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={template.thumbnailImageUrl || ''} onChange={(e) => onChange({ ...template, thumbnailImageUrl: e.target.value || undefined })} placeholder="https://..." />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Title</label>
        <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={template.title || ''} onChange={(e) => onChange({ ...template, title: e.target.value || undefined })} placeholder="Title (optional)" maxLength={40} />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Text *</label>
        <textarea className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm min-h-[60px]" value={template.text} onChange={(e) => onChange({ ...template, text: e.target.value })} maxLength={160} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Aspect Ratio</label>
          <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={template.imageAspectRatio || 'rectangle'} onChange={(e) => onChange({ ...template, imageAspectRatio: e.target.value as 'rectangle' | 'square' })}>
            <option value="rectangle">Rectangle</option>
            <option value="square">Square</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Image Size</label>
          <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={template.imageSize || 'cover'} onChange={(e) => onChange({ ...template, imageSize: e.target.value as 'cover' | 'contain' })}>
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Actions (max 4)</label>
        <div className="space-y-2">
          {template.actions.map((action, i) => (
            <div key={i} className="relative">
              <ActionEditor action={action} onChange={(a) => updateAction(i, a)} label={`Action ${i + 1}`} />
              {template.actions.length > 1 && (
                <button type="button" onClick={() => removeAction(i)} className="absolute top-2 right-8 text-red-500 text-xs">x</button>
              )}
            </div>
          ))}
          {template.actions.length < 4 && (
            <button type="button" onClick={addAction} className="w-full py-1.5 border-2 border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-green-400">+ Add Action</button>
          )}
        </div>
      </div>
    </div>
  )
}

function ConfirmEditor({ template, onChange }: { template: ConfirmTemplate; onChange: (t: ConfirmTemplate) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Text *</label>
        <textarea className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm min-h-[60px]" value={template.text} onChange={(e) => onChange({ ...template, text: e.target.value })} maxLength={240} />
      </div>
      <ActionEditor action={template.actions[0]} onChange={(a) => { const actions: [Action, Action] = [a, template.actions[1]]; onChange({ ...template, actions }) }} label="Left Button (Yes)" />
      <ActionEditor action={template.actions[1]} onChange={(a) => { const actions: [Action, Action] = [template.actions[0], a]; onChange({ ...template, actions }) }} label="Right Button (No)" />
    </div>
  )
}

function CarouselEditor({ template, onChange }: { template: CarouselTemplate; onChange: (t: CarouselTemplate) => void }) {
  const updateColumn = (i: number, col: CarouselColumn) => {
    const columns = [...template.columns]
    columns[i] = col
    onChange({ ...template, columns })
  }
  const addColumn = () => onChange({ ...template, columns: [...template.columns, { text: `Column ${template.columns.length + 1}`, actions: [{ type: 'message', label: 'Select', text: '' }] }] })
  const removeColumn = (i: number) => onChange({ ...template, columns: template.columns.filter((_, idx) => idx !== i) })

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Aspect Ratio</label>
          <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={template.imageAspectRatio || 'rectangle'} onChange={(e) => onChange({ ...template, imageAspectRatio: e.target.value as 'rectangle' | 'square' })}>
            <option value="rectangle">Rectangle</option>
            <option value="square">Square</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Image Size</label>
          <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={template.imageSize || 'cover'} onChange={(e) => onChange({ ...template, imageSize: e.target.value as 'cover' | 'contain' })}>
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
          </select>
        </div>
      </div>
      <label className="block text-xs text-gray-500">Columns (max 10)</label>
      {template.columns.map((col, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Column {i + 1}</span>
            {template.columns.length > 1 && <button type="button" onClick={() => removeColumn(i)} className="text-red-500 text-xs">Remove</button>}
          </div>
          <div className="space-y-2">
            <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={col.thumbnailImageUrl || ''} onChange={(e) => updateColumn(i, { ...col, thumbnailImageUrl: e.target.value || undefined })} placeholder="Thumbnail URL" />
            <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={col.title || ''} onChange={(e) => updateColumn(i, { ...col, title: e.target.value || undefined })} placeholder="Title" maxLength={40} />
            <textarea className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={col.text} onChange={(e) => updateColumn(i, { ...col, text: e.target.value })} placeholder="Text *" maxLength={120} />
            {col.actions.map((action, ai) => (
              <ActionEditor key={ai} action={action} onChange={(a) => { const actions = [...col.actions]; actions[ai] = a; updateColumn(i, { ...col, actions }) }} label={`Action ${ai + 1}`} />
            ))}
            {col.actions.length < 3 && (
              <button type="button" onClick={() => updateColumn(i, { ...col, actions: [...col.actions, { type: 'message', label: '', text: '' }] })} className="w-full py-1 border-2 border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-green-400">+ Add Action</button>
            )}
          </div>
        </div>
      ))}
      {template.columns.length < 10 && (
        <button type="button" onClick={addColumn} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-green-400">+ Add Column</button>
      )}
    </div>
  )
}

function ImageCarouselEditor({ template, onChange }: { template: ImageCarouselTemplate; onChange: (t: ImageCarouselTemplate) => void }) {
  const updateColumn = (i: number, col: ImageCarouselColumn) => {
    const columns = [...template.columns]
    columns[i] = col
    onChange({ ...template, columns })
  }
  const addColumn = () => onChange({ ...template, columns: [...template.columns, { imageUrl: 'https://example.com/image.jpg', action: { type: 'uri', label: 'View', uri: 'https://example.com' } }] })
  const removeColumn = (i: number) => onChange({ ...template, columns: template.columns.filter((_, idx) => idx !== i) })

  return (
    <div className="space-y-3">
      <label className="block text-xs text-gray-500">Image Columns (max 10)</label>
      {template.columns.map((col, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Column {i + 1}</span>
            {template.columns.length > 1 && <button type="button" onClick={() => removeColumn(i)} className="text-red-500 text-xs">Remove</button>}
          </div>
          <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm mb-2" value={col.imageUrl} onChange={(e) => updateColumn(i, { ...col, imageUrl: e.target.value })} placeholder="Image URL *" />
          <ActionEditor action={col.action} onChange={(action) => updateColumn(i, { ...col, action })} />
        </div>
      ))}
      {template.columns.length < 10 && (
        <button type="button" onClick={addColumn} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-green-400">+ Add Column</button>
      )}
    </div>
  )
}

export default function TemplateEditor({ message, onChange }: Props) {
  const templateType = message.template.type

  const handleTemplateTypeChange = (newType: TemplateType) => {
    onChange({ ...message, template: defaultTemplate(newType) })
  }

  const handleTemplateChange = (template: Template) => {
    onChange({ ...message, template })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={message.altText}
          onChange={(e) => onChange({ ...message, altText: e.target.value })}
          placeholder="Alternative text"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Template Type</label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.entries(TEMPLATE_TYPE_LABELS) as [TemplateType, string][]).map(([type, label]) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTemplateTypeChange(type)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                templateType === type
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {templateType === 'buttons' && <ButtonsEditor template={message.template as ButtonsTemplate} onChange={(t) => handleTemplateChange(t)} />}
      {templateType === 'confirm' && <ConfirmEditor template={message.template as ConfirmTemplate} onChange={(t) => handleTemplateChange(t)} />}
      {templateType === 'carousel' && <CarouselEditor template={message.template as CarouselTemplate} onChange={(t) => handleTemplateChange(t)} />}
      {templateType === 'image_carousel' && <ImageCarouselEditor template={message.template as ImageCarouselTemplate} onChange={(t) => handleTemplateChange(t)} />}
    </div>
  )
}
