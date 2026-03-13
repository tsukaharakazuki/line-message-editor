import type { FlexMessage } from '../../types/line'
import Editor from '@monaco-editor/react'

interface Props {
  message: FlexMessage
  onChange: (message: FlexMessage) => void
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
  const contentsJson = JSON.stringify(message.contents, null, 2)

  const handleEditorChange = (value: string | undefined) => {
    if (!value) return
    try {
      const parsed = JSON.parse(value)
      onChange({ ...message, contents: parsed })
    } catch {
      // invalid JSON, ignore
    }
  }

  const applyTemplate = (contents: FlexMessage['contents']) => {
    onChange({ ...message, contents })
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Flex Contents (JSON)</label>
        <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <Editor
            height="100%"
            language="json"
            theme="vs-dark"
            value={contentsJson}
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
