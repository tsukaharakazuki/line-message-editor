import { useState } from 'react'
import Editor from '@monaco-editor/react'

interface Props {
  json: string
  onJsonChange?: (json: string) => void
}

export default function JsonPanel({ json, onJsonChange }: Props) {
  const [copied, setCopied] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-300 text-sm border-b border-gray-700">
        <span className="font-medium">JSON Output</span>
        <div className="flex gap-2">
          {onJsonChange && (
            <button
              type="button"
              onClick={() => setEditMode(!editMode)}
              className={`px-3 py-1 rounded text-xs ${editMode ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              {editMode ? 'Editing' : 'Edit JSON'}
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language="json"
          theme="vs-dark"
          value={json}
          onChange={(value) => {
            if (editMode && onJsonChange && value !== undefined) {
              onJsonChange(value)
            }
          }}
          options={{
            readOnly: !editMode,
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
  )
}
