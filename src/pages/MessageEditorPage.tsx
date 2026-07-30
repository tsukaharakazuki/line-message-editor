import { useState, useCallback, useRef } from 'react'
import type { LineMessage, MessageType } from '../types/line'
import { MESSAGE_TYPE_LABELS } from '../types/line'
import { defaultMessage } from '../utils/templates'
import { useLocalStorage } from '../hooks/useLocalStorage'
import TextEditor from '../components/editors/TextEditor'
import StickerEditor from '../components/editors/StickerEditor'
import ImageEditor from '../components/editors/ImageEditor'
import VideoEditor from '../components/editors/VideoEditor'
import AudioEditor from '../components/editors/AudioEditor'
import LocationEditor from '../components/editors/LocationEditor'
import ImagemapEditor from '../components/editors/ImagemapEditor'
import TemplateEditor from '../components/editors/TemplateEditor'
import FlexEditor from '../components/editors/FlexEditor'
import CouponEditor from '../components/editors/CouponEditor'
import QuickReplyEditor from '../components/common/QuickReplyEditor'
import ChatPreview from '../components/preview/ChatPreview'
import { Button } from '../components/ui/Button'
import { Copy, Download, Upload } from 'lucide-react'
import { downloadJson } from '../utils/json'
import JsonImportDialog from '../components/common/JsonImportDialog'
import { toast } from 'sonner'

const MESSAGE_TYPES: MessageType[] = ['text', 'sticker', 'image', 'video', 'audio', 'location', 'imagemap', 'template', 'flex', 'coupon']
const MAX_MESSAGES = 5

function isLineMessage(value: unknown): value is LineMessage {
  return typeof value === 'object' && value !== null && 'type' in value && typeof value.type === 'string'
}

function validateMessages(value: unknown): LineMessage[] {
  if (Array.isArray(value) && value.length >= 1 && value.length <= MAX_MESSAGES && value.every(isLineMessage)) return value
  if (isLineMessage(value)) return [value]
  throw new Error('メッセージ配列、またはtypeを持つメッセージオブジェクトを指定してください')
}

export default function MessageEditorPage() {
  const [messages, setMessages] = useLocalStorage<LineMessage[]>('line-msg-editor-v2', [defaultMessage('text')])
  const [activeIndex, setActiveIndex] = useState(0)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const addBtnRef = useRef<HTMLButtonElement>(null)
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  // Ensure activeIndex is within bounds
  const safeIndex = Math.min(activeIndex, messages.length - 1)
  const activeMessage = messages[safeIndex]
  const isLastMessage = safeIndex === messages.length - 1

  const updateMessage = useCallback((msg: LineMessage) => {
    setMessages(prev => {
      const next = [...prev]
      next[safeIndex] = msg
      return next
    })
  }, [safeIndex, setMessages])

  const addMessage = useCallback((type: MessageType) => {
    if (messages.length >= MAX_MESSAGES) return
    const newMsg = defaultMessage(type)
    setMessages(prev => [...prev, newMsg])
    setActiveIndex(messages.length)
    setShowAddMenu(false)
  }, [messages.length, setMessages])

  const removeMessage = useCallback((index: number) => {
    if (messages.length <= 1) return
    setMessages(prev => {
      const next = prev.filter((_, i) => i !== index)
      // Strip quickReply from non-last messages
      return next.map((m, i) => i < next.length - 1 ? stripQuickReply(m) : m)
    })
    if (safeIndex >= messages.length - 1) {
      setActiveIndex(Math.max(0, messages.length - 2))
    } else if (index < safeIndex) {
      setActiveIndex(safeIndex - 1)
    }
  }, [messages.length, safeIndex, setMessages])

  const changeMessageType = useCallback((index: number, type: MessageType) => {
    setMessages(prev => {
      const next = [...prev]
      next[index] = defaultMessage(type)
      return next
    })
  }, [setMessages])

  const moveMessage = useCallback((index: number, direction: 'left' | 'right') => {
    const swapIdx = direction === 'left' ? index - 1 : index + 1
    if (swapIdx < 0 || swapIdx >= messages.length) return
    setMessages(prev => {
      const next = [...prev]
      ;[next[index], next[swapIdx]] = [next[swapIdx], next[index]]
      // Strip quickReply from non-last messages
      return next.map((m, i) => i < next.length - 1 ? stripQuickReply(m) : m)
    })
    setActiveIndex(swapIdx)
  }, [messages.length, setMessages])

  const jsonOutput = JSON.stringify(
    messages.length === 1 ? messages[0] : messages,
    null, 2
  )

  const renderEditor = () => {
    const message = activeMessage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onChange = updateMessage as any
    switch (message.type) {
      case 'text':
        return <TextEditor message={message} onChange={onChange} />
      case 'sticker':
        return <StickerEditor message={message} onChange={onChange} />
      case 'image':
        return <ImageEditor message={message} onChange={onChange} />
      case 'video':
        return <VideoEditor message={message} onChange={onChange} />
      case 'audio':
        return <AudioEditor message={message} onChange={onChange} />
      case 'location':
        return <LocationEditor message={message} onChange={onChange} />
      case 'imagemap':
        return <ImagemapEditor message={message} onChange={onChange} />
      case 'template':
        return <TemplateEditor message={message} onChange={onChange} />
      case 'flex':
        return <FlexEditor message={message} onChange={onChange} />
      case 'coupon':
        return <CouponEditor message={message} onChange={onChange} />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#06C755]">Message editor</p><p className="text-sm font-semibold text-slate-800">LINEメッセージを作成</p></div>
        <div className="flex items-center gap-2"><Button type="button" size="sm" variant="outline" onClick={async () => { await navigator.clipboard.writeText(jsonOutput); toast.success('JSONをコピーしました') }}><Copy className="mr-1.5 h-3.5 w-3.5" /> コピー</Button><Button type="button" size="sm" variant="outline" onClick={() => downloadJson('line-messages.json', JSON.parse(jsonOutput))}><Download className="mr-1.5 h-3.5 w-3.5" /> JSONダウンロード</Button><Button type="button" size="sm" variant="outline" onClick={() => setShowImportDialog(true)}><Upload className="mr-1.5 h-3.5 w-3.5" /> インポート</Button></div>
      </div>
      {/* Message Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-1 overflow-x-auto flex-shrink-0">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-center gap-1 px-1 rounded-lg border transition-colors flex-shrink-0 ${
              i === safeIndex
                ? 'border-[#06C755] bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            {/* Move left */}
            {i > 0 && i === safeIndex && (
              <button
                type="button"
                onClick={() => moveMessage(i, 'left')}
                className="text-gray-400 hover:text-gray-600 p-0.5"
                title="Move left"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}

            {/* Tab button */}
            <button
              type="button"
              onClick={() => setActiveIndex(i)}
              className="py-1.5 pl-2 pr-1 text-xs font-medium flex items-center gap-1.5"
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                i === safeIndex ? 'bg-[#06C755] text-white' : 'bg-gray-200 text-gray-500'
              }`}>{i + 1}</span>
              {/* Type selector */}
              <select
                value={msg.type}
                onChange={(e) => changeMessageType(i, e.target.value as MessageType)}
                onClick={(e) => e.stopPropagation()}
                className={`bg-transparent text-xs font-medium cursor-pointer outline-none ${
                  i === safeIndex ? 'text-[#06C755]' : 'text-gray-600'
                }`}
              >
                {MESSAGE_TYPES.map(t => (
                  <option key={t} value={t}>{MESSAGE_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </button>

            {/* Move right */}
            {i < messages.length - 1 && i === safeIndex && (
              <button
                type="button"
                onClick={() => moveMessage(i, 'right')}
                className="text-gray-400 hover:text-gray-600 p-0.5"
                title="Move right"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            )}

            {/* Delete */}
            {messages.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeMessage(i) }}
                className="text-gray-300 hover:text-red-500 p-0.5 transition-colors"
                title="Remove message"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        ))}

        {/* Add Message Button */}
        {messages.length < MAX_MESSAGES && (
          <div className="relative flex-shrink-0">
            <button
              ref={addBtnRef}
              type="button"
              onClick={() => {
                if (addBtnRef.current) {
                  const rect = addBtnRef.current.getBoundingClientRect()
                  setMenuPos({ top: rect.bottom + 4, left: rect.left })
                }
                setShowAddMenu(!showAddMenu)
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:border-[#06C755] hover:text-[#06C755] transition-colors text-xs font-medium"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add
            </button>
            {showAddMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
                <div
                  className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[140px]"
                  style={{ top: menuPos.top, left: menuPos.left }}
                >
                  {MESSAGE_TYPES.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => addMessage(t)}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 text-gray-700"
                    >
                      {MESSAGE_TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Editor Panel */}
        <div className="w-1/2 border-r border-gray-200 overflow-y-auto bg-white">
          <div className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Message {safeIndex + 1} - {MESSAGE_TYPE_LABELS[activeMessage.type]} Editor
            </h2>
            {renderEditor()}
            {isLastMessage ? (
              <QuickReplyEditor
                quickReply={activeMessage.quickReply}
                onChange={(qr) => updateMessage({ ...activeMessage, quickReply: qr } as LineMessage)}
              />
            ) : (
              <div className="mt-6 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-400">Quick Reply は最後のメッセージ (Message {messages.length}) にのみ設定可能です</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Preview + JSON */}
        <div className="w-1/2 flex flex-col min-h-0">
          {/* Preview */}
          <div className="flex-1 p-4 overflow-y-auto min-h-0">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Preview</h2>
            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200" style={{ maxWidth: '375px' }}>
              <ChatPreview messages={messages} activeIndex={safeIndex} />
            </div>
          </div>

        </div>
      </div>
      <JsonImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} title="メッセージJSONをインポート" validate={validateMessages} onImport={(value) => { setMessages(value); setActiveIndex(0) }} />
    </div>
  )
}

function stripQuickReply(msg: LineMessage): LineMessage {
  if (!msg.quickReply) return msg
  const { quickReply: _, ...rest } = msg as LineMessage & { quickReply?: unknown }
  return rest as LineMessage
}

