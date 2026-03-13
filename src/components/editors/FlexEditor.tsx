import { useState, useMemo } from 'react'
import type { FlexMessage, FlexContainer } from '../../types/line'
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
  // Deduplicate by path
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
  // Navigate to the image object and set url
  let current: Record<string, unknown> = clone
  for (let i = 0; i < parts.length; i++) {
    const key = parts[i]
    if (i === parts.length - 1) {
      // This should be the image object
      if (current[key] && typeof current[key] === 'object') {
        (current[key] as Record<string, unknown>).url = value
      }
    } else {
      current = (current as Record<string, unknown>)[key] as Record<string, unknown>
    }
  }
  return clone
}

const FLEX_TEMPLATES = [
  {
    name: 'Simple Bubble',
    contents: {
      type: 'bubble' as const,
      body: {
        type: 'box' as const,
        layout: 'vertical' as const,
        contents: [
          { type: 'text' as const, text: 'Hello, World!', weight: 'bold' as const, size: 'xl' },
          { type: 'text' as const, text: 'This is a Flex Message', size: 'sm', color: '#999999', margin: 'md' },
        ],
      },
    },
  },
  {
    name: 'With Image',
    contents: {
      type: 'bubble' as const,
      hero: {
        type: 'image' as const,
        url: 'https://developers-resource.landpress.line.me/fx/img/01_1_cafe.png',
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover' as const,
      },
      body: {
        type: 'box' as const,
        layout: 'vertical' as const,
        contents: [
          { type: 'text' as const, text: 'Brown Cafe', weight: 'bold' as const, size: 'xl' },
          { type: 'text' as const, text: 'A cozy place for coffee', size: 'sm', color: '#999999', margin: 'md', wrap: true },
        ],
      },
      footer: {
        type: 'box' as const,
        layout: 'vertical' as const,
        contents: [
          { type: 'button' as const, action: { type: 'uri' as const, label: 'Visit', uri: 'https://example.com' }, style: 'primary' as const },
        ],
      },
    },
  },
  {
    name: 'Shopping',
    contents: {
      type: 'bubble' as const,
      hero: {
        type: 'image' as const,
        url: 'https://developers-resource.landpress.line.me/fx/img/01_1_cafe.png',
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover' as const,
      },
      body: {
        type: 'box' as const,
        layout: 'vertical' as const,
        contents: [
          { type: 'text' as const, text: 'Product Name', weight: 'bold' as const, size: 'xl' },
          {
            type: 'box' as const, layout: 'horizontal' as const, margin: 'md', contents: [
              { type: 'text' as const, text: '$29.99', size: 'xl', weight: 'bold' as const, color: '#EE4D2D' },
              { type: 'text' as const, text: '$49.99', size: 'sm', color: '#AAAAAA', gravity: 'bottom' as const, decoration: 'line-through' as const },
            ]
          },
          { type: 'text' as const, text: 'Limited time offer!', size: 'xs', color: '#999999', margin: 'md' },
        ],
      },
      footer: {
        type: 'box' as const,
        layout: 'horizontal' as const,
        spacing: 'sm',
        contents: [
          { type: 'button' as const, action: { type: 'uri' as const, label: 'Buy Now', uri: 'https://example.com' }, style: 'primary' as const, color: '#EE4D2D' },
          { type: 'button' as const, action: { type: 'uri' as const, label: 'Details', uri: 'https://example.com' }, style: 'secondary' as const },
        ],
      },
    },
  },
]

export default function FlexEditor({ message, onChange }: Props) {
  const [editorValue, setEditorValue] = useState(() => JSON.stringify(message.contents, null, 2))

  // Find all image URLs in the current contents
  const imageEntries = useMemo(() => findImageUrls(message.contents), [message.contents])

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
  }

  const updateImageUrl = (path: string, newUrl: string) => {
    const updated = setAtPath(message.contents, path, newUrl) as FlexContainer
    onChange({ ...message, contents: updated })
    setEditorValue(JSON.stringify(updated, null, 2))
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Templates</label>
        <div className="flex gap-2 flex-wrap">
          {FLEX_TEMPLATES.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => applyTemplate(t.contents as FlexMessage['contents'])}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-600 transition-colors"
            >
              {t.name}
            </button>
          ))}
        </div>
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Flex Contents (JSON)</label>
        <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '400px' }}>
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
      </div>
    </div>
  )
}
