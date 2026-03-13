import { useState, useCallback } from 'react'
import type { LineMessage, MessageType } from './types/line'
import { MESSAGE_TYPE_LABELS } from './types/line'
import { defaultMessage } from './utils/templates'
import { useLocalStorage } from './hooks/useLocalStorage'
import TextEditor from './components/editors/TextEditor'
import StickerEditor from './components/editors/StickerEditor'
import ImageEditor from './components/editors/ImageEditor'
import VideoEditor from './components/editors/VideoEditor'
import AudioEditor from './components/editors/AudioEditor'
import LocationEditor from './components/editors/LocationEditor'
import ImagemapEditor from './components/editors/ImagemapEditor'
import TemplateEditor from './components/editors/TemplateEditor'
import FlexEditor from './components/editors/FlexEditor'
import CouponEditor from './components/editors/CouponEditor'
import QuickReplyEditor from './components/common/QuickReplyEditor'
import JsonPanel from './components/common/JsonPanel'
import ChatPreview from './components/preview/ChatPreview'

const MESSAGE_TYPES: MessageType[] = ['text', 'sticker', 'image', 'video', 'audio', 'location', 'imagemap', 'template', 'flex', 'coupon']

function App() {
  const [savedMessages, setSavedMessages] = useLocalStorage<Record<MessageType, LineMessage>>('line-msg-editor', {} as Record<MessageType, LineMessage>)
  const [messageType, setMessageType] = useState<MessageType>('text')

  const message: LineMessage = savedMessages[messageType] || defaultMessage(messageType)

  const setMessage = useCallback((msg: LineMessage) => {
    setSavedMessages((prev) => ({ ...prev, [messageType]: msg }))
  }, [messageType, setSavedMessages])

  const handleTypeChange = (type: MessageType) => {
    setMessageType(type)
  }

  const handleJsonChange = (json: string) => {
    try {
      const parsed = JSON.parse(json) as LineMessage
      if (parsed.type === messageType) {
        setMessage(parsed)
      }
    } catch {
      // invalid JSON
    }
  }

  const jsonOutput = JSON.stringify(message, null, 2)

  const renderEditor = () => {
    switch (message.type) {
      case 'text':
        return <TextEditor message={message} onChange={setMessage as (m: typeof message) => void} />
      case 'sticker':
        return <StickerEditor message={message} onChange={setMessage as (m: typeof message) => void} />
      case 'image':
        return <ImageEditor message={message} onChange={setMessage as (m: typeof message) => void} />
      case 'video':
        return <VideoEditor message={message} onChange={setMessage as (m: typeof message) => void} />
      case 'audio':
        return <AudioEditor message={message} onChange={setMessage as (m: typeof message) => void} />
      case 'location':
        return <LocationEditor message={message} onChange={setMessage as (m: typeof message) => void} />
      case 'imagemap':
        return <ImagemapEditor message={message} onChange={setMessage as (m: typeof message) => void} />
      case 'template':
        return <TemplateEditor message={message} onChange={setMessage as (m: typeof message) => void} />
      case 'flex':
        return <FlexEditor message={message} onChange={setMessage as (m: typeof message) => void} />
      case 'coupon':
        return <CouponEditor message={message} onChange={setMessage as (m: typeof message) => void} />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#06C755] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-gray-800">LINE Message Editor</h1>
        </div>
        <a
          href="https://developers.line.biz/en/docs/messaging-api/message-types/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          LINE API Docs
        </a>
      </header>

      {/* Message Type Selector */}
      <div className="bg-white border-b border-gray-200 px-6 py-2 flex gap-1 overflow-x-auto flex-shrink-0">
        {MESSAGE_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleTypeChange(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              messageType === type
                ? 'bg-[#06C755] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {MESSAGE_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Editor Panel */}
        <div className="w-1/2 border-r border-gray-200 overflow-y-auto bg-white">
          <div className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {MESSAGE_TYPE_LABELS[messageType]} Editor
            </h2>
            {renderEditor()}
            <QuickReplyEditor
              quickReply={message.quickReply}
              onChange={(qr) => setMessage({ ...message, quickReply: qr } as LineMessage)}
            />
          </div>
        </div>

        {/* Right Panel: Preview + JSON */}
        <div className="w-1/2 flex flex-col min-h-0">
          {/* Preview */}
          <div className="flex-1 p-4 overflow-y-auto min-h-0">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Preview</h2>
            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200" style={{ maxWidth: '375px' }}>
              <ChatPreview message={message} />
            </div>
          </div>

          {/* JSON Panel */}
          <div className="h-[300px] border-t border-gray-200 flex-shrink-0">
            <JsonPanel json={jsonOutput} onJsonChange={handleJsonChange} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
