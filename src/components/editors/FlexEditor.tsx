import { useState, useMemo, useCallback } from 'react'
import type { FlexMessage, FlexContainer, FlexBubble, FlexComponent, FlexBox } from '../../types/line'
import { FLEX_TEMPLATES, FLEX_TEMPLATE_CATEGORIES } from '../../data/flexTemplates'
import type { FlexTemplate } from '../../data/flexTemplates'
import BubbleSettingsPanel from './BubbleSettingsPanel'
import FlexRenderer from '../preview/FlexRenderer'
import ComponentTree from './flex/ComponentTree'
import PropertyPanel from './flex/PropertyPanel'
import Editor from '@monaco-editor/react'

interface Props {
  message: FlexMessage
  onChange: (message: FlexMessage) => void
}

// Recursively find all image URLs in a Flex container
function findImageUrls(obj: unknown, path = ''): Array<{ path: string; url: string }> {
  const results: Array<{ path: string; url: string }> = []
  if (!obj || typeof obj !== 'object') return results
  const record = obj as Record<string, unknown>
  if (record.type === 'image' && typeof record.url === 'string') {
    results.push({ path, url: record.url })
  }
  if (record.type === 'bubble' && record.hero && typeof record.hero === 'object') {
    const hero = record.hero as Record<string, unknown>
    if (hero.type === 'image' && typeof hero.url === 'string') {
      results.push({ path: `${path}.hero`, url: hero.url })
    }
  }
  if (Array.isArray(record.contents)) {
    record.contents.forEach((item: unknown, i: number) => {
      results.push(...findImageUrls(item, `${path}.contents[${i}]`))
    })
  }
  if (record.body) results.push(...findImageUrls(record.body, `${path}.body`))
  if (record.header) results.push(...findImageUrls(record.header, `${path}.header`))
  if (record.footer) results.push(...findImageUrls(record.footer, `${path}.footer`))
  const seen = new Set<string>()
  return results.filter(r => { if (seen.has(r.path)) return false; seen.add(r.path); return true })
}

// Set a value at a dot-bracket path like ".hero.url" or ".contents[0].url"
function setAtPath(obj: unknown, path: string, value: string): unknown {
  const clone = JSON.parse(JSON.stringify(obj))
  const parts = path.replace(/^\./, '').split(/\./).flatMap(p => {
    const match = p.match(/^(\w+)\[(\d+)\]$/)
    if (match) return [match[1], Number(match[2])]
    return [p]
  })
  let current: Record<string, unknown> = clone
  for (let i = 0; i < parts.length; i++) {
    const key = parts[i]
    if (i === parts.length - 1) {
      if (current[key] && typeof current[key] === 'object') {
        (current[key] as Record<string, unknown>).url = value
      }
    } else {
      current = (current as Record<string, unknown>)[key] as Record<string, unknown>
    }
  }
  return clone
}

// Navigate into a bubble using a dot-separated path string
function getComponentAtPath(bubble: FlexBubble, path: string): FlexComponent | null {
  const parts = path.split('.')
  let current: unknown = bubble
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return null
    current = (current as Record<string, unknown>)[part]
  }
  return (current as FlexComponent) || null
}

// Immutably update a component at a given path within a bubble
function updateComponentAtPath(bubble: FlexBubble, path: string, updater: (c: FlexComponent) => FlexComponent): FlexBubble {
  const clone: FlexBubble = JSON.parse(JSON.stringify(bubble))
  const parts = path.split('.')
  let current: unknown = clone
  for (let i = 0; i < parts.length - 1; i++) {
    current = (current as Record<string, unknown>)[parts[i]]
  }
  const lastKey = parts[parts.length - 1]
  const target = (current as Record<string, unknown>)[lastKey] as FlexComponent
  ;(current as Record<string, unknown>)[lastKey] = updater(target)
  return clone
}

// Create a default component of a given type
function createDefaultComponent(type: FlexComponent['type']): FlexComponent {
  switch (type) {
    case 'box': return { type: 'box', layout: 'vertical', contents: [] }
    case 'text': return { type: 'text', text: 'Text' }
    case 'image': return { type: 'image', url: 'https://via.placeholder.com/300x200' }
    case 'button': return { type: 'button', action: { type: 'uri', label: 'Button', uri: 'https://example.com' }, style: 'primary' }
    case 'icon': return { type: 'icon', url: 'https://via.placeholder.com/20' }
    case 'separator': return { type: 'separator' }
    case 'filler': return { type: 'filler' }
    case 'span': return { type: 'span', text: 'span' }
  }
}

function TemplatePicker({ onSelect }: { onSelect: (contents: FlexContainer) => void }) {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filtered = selectedCategory === 'all'
    ? FLEX_TEMPLATES
    : FLEX_TEMPLATES.filter(t => t.category === selectedCategory)

  return (
    <div className="space-y-2">
      <div className="flex gap-1 overflow-x-auto pb-1">
        {FLEX_TEMPLATE_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.key
                ? 'bg-[#06C755] text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-1">
        {filtered.map((template) => (
          <TemplateCard key={template.id} template={template} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}

function TemplateCard({ template, onSelect }: { template: FlexTemplate; onSelect: (contents: FlexContainer) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(template.contents)}
      className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#06C755] hover:shadow-md transition-all text-left group"
    >
      <div className="h-[100px] overflow-hidden bg-gray-50 relative">
        <div style={{ transform: 'scale(0.3)', transformOrigin: 'top left', width: '333%' }}>
          <FlexRenderer container={template.contents} />
        </div>
      </div>
      <div className="px-2.5 py-2 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-800 group-hover:text-[#06C755] transition-colors">{template.name}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{template.description}</p>
      </div>
    </button>
  )
}

export default function FlexEditor({ message, onChange }: Props) {
  const [editorValue, setEditorValue] = useState(() => JSON.stringify(message.contents, null, 2))
  const [showPicker, setShowPicker] = useState(false)
  const [editorMode, setEditorMode] = useState<'gui' | 'json'>('gui')
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  const imageEntries = useMemo(() => findImageUrls(message.contents), [message.contents])

  const bubble = message.contents.type === 'bubble' ? message.contents as FlexBubble : null

  const updateContents = useCallback((contents: FlexContainer) => {
    onChange({ ...message, contents })
    setEditorValue(JSON.stringify(contents, null, 2))
  }, [message, onChange])

  const handleEditorChange = (value: string | undefined) => {
    if (!value) return
    setEditorValue(value)
    try {
      const parsed = JSON.parse(value)
      onChange({ ...message, contents: parsed })
    } catch {
      // invalid JSON, ignore
    }
  }

  const applyTemplate = (contents: FlexMessage['contents']) => {
    onChange({ ...message, contents })
    setEditorValue(JSON.stringify(contents, null, 2))
    setShowPicker(false)
    setSelectedPath(null)
  }

  const updateImageUrl = (path: string, newUrl: string) => {
    const updated = setAtPath(message.contents, path, newUrl) as FlexContainer
    onChange({ ...message, contents: updated })
    setEditorValue(JSON.stringify(updated, null, 2))
  }

  const handleBubbleSettingsChange = (contents: FlexContainer) => {
    onChange({ ...message, contents })
    setEditorValue(JSON.stringify(contents, null, 2))
  }

  // GUI editor handlers
  const handleComponentChange = useCallback((component: FlexComponent) => {
    if (!bubble || !selectedPath) return
    const updated = updateComponentAtPath(bubble, selectedPath, () => component)
    updateContents(updated)
  }, [bubble, selectedPath, updateContents])

  const handleAdd = useCallback((parentPath: string, type: FlexComponent['type']) => {
    if (!bubble) return
    const newComponent = createDefaultComponent(type)
    const clone: FlexBubble = JSON.parse(JSON.stringify(bubble))

    // Navigate to the parent box
    const parts = parentPath.split('.')
    let current: unknown = clone
    for (const part of parts) {
      current = (current as Record<string, unknown>)[part]
    }
    const box = current as FlexBox
    if (box && Array.isArray(box.contents)) {
      box.contents.push(newComponent)
      updateContents(clone)
      setSelectedPath(`${parentPath}.contents.${box.contents.length - 1}`)
    }
  }, [bubble, updateContents])

  const handleRemove = useCallback((path: string) => {
    if (!bubble) return
    const clone: FlexBubble = JSON.parse(JSON.stringify(bubble))
    const parts = path.split('.')
    const index = Number(parts.pop()!)
    const arrayKey = parts.pop()! // 'contents'

    let current: unknown = clone
    for (const part of parts) {
      current = (current as Record<string, unknown>)[part]
    }
    const arr = (current as Record<string, unknown>)[arrayKey] as FlexComponent[]
    if (Array.isArray(arr)) {
      arr.splice(index, 1)
      updateContents(clone)
      if (selectedPath === path) setSelectedPath(null)
    }
  }, [bubble, selectedPath, updateContents])

  const handleMove = useCallback((path: string, direction: 'up' | 'down') => {
    if (!bubble) return
    const clone: FlexBubble = JSON.parse(JSON.stringify(bubble))
    const parts = path.split('.')
    const index = Number(parts.pop()!)
    const arrayKey = parts.pop()! // 'contents'

    let current: unknown = clone
    for (const part of parts) {
      current = (current as Record<string, unknown>)[part]
    }
    const arr = (current as Record<string, unknown>)[arrayKey] as FlexComponent[]
    if (!Array.isArray(arr)) return

    const swapIdx = direction === 'up' ? index - 1 : index + 1
    if (swapIdx < 0 || swapIdx >= arr.length) return

    ;[arr[index], arr[swapIdx]] = [arr[swapIdx], arr[index]]
    updateContents(clone)

    const parentPath = parts.join('.')
    const newPath = `${parentPath ? parentPath + '.' : ''}${arrayKey}.${swapIdx}`
    setSelectedPath(newPath)
  }, [bubble, updateContents])

  const selectedComponent = bubble && selectedPath ? getComponentAtPath(bubble, selectedPath) : null

  return (
    <div className="space-y-4">
      {/* Alt Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={message.altText}
          onChange={(e) => onChange({ ...message, altText: e.target.value })}
          placeholder="Alternative text"
        />
      </div>

      {/* Templates */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Templates</label>
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              showPicker
                ? 'bg-[#06C755] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {showPicker ? 'Close' : 'Browse All'}
          </button>
        </div>

        {!showPicker && (
          <div className="flex gap-2 flex-wrap">
            {FLEX_TEMPLATES.slice(0, 5).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => applyTemplate(t.contents)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-600 transition-colors"
              >
                {t.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-400 transition-colors"
            >
              +{FLEX_TEMPLATES.length - 5} more
            </button>
          </div>
        )}

        {showPicker && <TemplatePicker onSelect={applyTemplate} />}
      </div>

      {/* Bubble Settings */}
      <BubbleSettingsPanel
        contents={message.contents}
        onChange={handleBubbleSettingsChange}
      />

      {/* Editor Mode Tabs */}
      <div>
        <div className="flex border-b border-gray-200 mb-0">
          {(['gui', 'json'] as const).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                if (mode === 'json') {
                  setEditorValue(JSON.stringify(message.contents, null, 2))
                }
                setEditorMode(mode)
              }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                editorMode === mode
                  ? 'border-[#06C755] text-[#06C755]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {mode === 'gui' ? 'GUI Editor' : 'JSON'}
            </button>
          ))}
        </div>

        {/* GUI Mode */}
        {editorMode === 'gui' && bubble && (
          <div className="flex border border-gray-200 rounded-b-lg overflow-hidden" style={{ minHeight: 'calc(100vh - 320px)' }}>
            {/* Tree panel */}
            <div className="w-[200px] border-r border-gray-200 overflow-y-auto bg-white flex-shrink-0">
              <ComponentTree
                bubble={bubble}
                selectedPath={selectedPath}
                onSelect={setSelectedPath}
                onAdd={handleAdd}
                onRemove={handleRemove}
                onMove={handleMove}
              />
            </div>
            {/* Property panel */}
            <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
              {selectedComponent ? (
                <PropertyPanel
                  component={selectedComponent}
                  onChange={handleComponentChange}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-gray-400">Select a component from the tree</p>
                </div>
              )}
            </div>
          </div>
        )}

        {editorMode === 'gui' && !bubble && (
          <div className="border border-gray-200 rounded-b-lg p-4 text-center text-sm text-gray-400">
            GUI editor is only available for bubble type. Switch to a bubble template or use JSON mode.
          </div>
        )}

        {/* JSON Mode */}
        {editorMode === 'json' && (
          <div className="border border-gray-200 rounded-b-lg overflow-hidden" style={{ height: '400px' }}>
            <Editor
              height="100%"
              language="json"
              theme="vs-dark"
              value={editorValue}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                formatOnPaste: true,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
        )}
      </div>

      {/* Image URL quick editor */}
      {imageEntries.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs</label>
          <div className="space-y-2">
            {imageEntries.map((entry, i) => (
              <div key={entry.path} className="flex gap-2 items-start">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Image {i + 1} <span className="text-gray-300">({entry.path})</span></label>
                  <input
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                    value={entry.url}
                    onChange={(e) => updateImageUrl(entry.path, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                {entry.url && entry.url.startsWith('http') && (
                  <img
                    src={entry.url}
                    alt=""
                    className="w-12 h-12 object-cover rounded border border-gray-200 flex-shrink-0 mt-5"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
