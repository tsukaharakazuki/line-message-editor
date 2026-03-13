import { useState, useEffect } from 'react'
import type { LineMessage, ButtonsTemplate, ConfirmTemplate, CarouselTemplate, ImageCarouselTemplate } from '../../types/line'
import FlexRenderer from './FlexRenderer'

interface Props {
  message: LineMessage
}

export default function ChatPreview({ message }: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* LINE-like header */}
      <div className="bg-[#06C755] text-white px-4 py-3 flex items-center gap-3 rounded-t-xl">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">B</div>
        <span className="font-medium text-sm">Bot Preview</span>
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-[#7494C0] p-4 overflow-y-auto" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'1\' fill=\'rgba(255,255,255,0.1)\'/%3E%3C/svg%3E")' }}>
        <div className="flex items-end gap-2">
          <div className="w-8 h-8 rounded-full bg-white/50 flex-shrink-0 flex items-center justify-center text-xs">B</div>
          <div className="max-w-[85%]">
            <MessageContent message={message} />
          </div>
        </div>
      </div>

      {/* Quick Reply preview */}
      {message.quickReply && message.quickReply.items.length > 0 && (
        <div className="bg-white border-t border-gray-200 px-3 py-2 overflow-x-auto rounded-b-xl">
          <div className="flex gap-2">
            {message.quickReply.items.map((item, i) => (
              <button
                key={i}
                type="button"
                className="flex-shrink-0 px-4 py-1.5 border border-[#06C755] text-[#06C755] rounded-full text-xs font-medium whitespace-nowrap"
              >
                {item.action.label || item.action.type}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SafeImage({ src, alt, className, fallback }: { src: string; alt: string; className?: string; fallback: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)
  useEffect(() => { setHasError(false) }, [src])
  if (hasError || !src) return <>{fallback}</>
  return <img src={src} alt={alt} className={className} onError={() => setHasError(true)} />
}

function MessageContent({ message }: { message: LineMessage }) {
  switch (message.type) {
    case 'text':
      return (
        <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
          <p className="text-sm whitespace-pre-wrap break-words">{message.text || '\u00A0'}</p>
        </div>
      )

    case 'sticker':
      return (
        <div className="p-2">
          <SafeImage
            src={`https://stickershop.line-scdn.net/stickershop/v1/sticker/${message.stickerId}/iPhone/sticker@2x.png`}
            alt="sticker"
            className="w-24 h-24 object-contain"
            fallback={
              <div className="w-24 h-24 bg-white/80 rounded-xl flex items-center justify-center text-xs text-gray-500 text-center">
                Sticker<br />{message.packageId}/{message.stickerId}
              </div>
            }
          />
        </div>
      )

    case 'image':
      return (
        <div className="rounded-2xl rounded-bl-sm overflow-hidden shadow-sm max-w-[240px]">
          <SafeImage
            src={message.previewImageUrl}
            alt="image"
            className="w-full object-cover"
            fallback={
              <div className="w-60 h-40 bg-gray-200 flex items-center justify-center text-xs text-gray-500">Image Preview</div>
            }
          />
        </div>
      )

    case 'video':
      return (
        <div className="rounded-2xl rounded-bl-sm overflow-hidden shadow-sm bg-black max-w-[240px]">
          <div className="w-60 h-40 flex items-center justify-center relative">
            <SafeImage
              src={message.previewImageUrl}
              alt="video preview"
              className="absolute inset-0 w-full h-full object-cover"
              fallback={<div className="absolute inset-0 bg-gray-800" />}
            />
            <div className="relative w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-gray-700 ml-1" />
            </div>
          </div>
        </div>
      )

    case 'audio':
      return (
        <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-3 min-w-[200px]">
          <div className="w-8 h-8 rounded-full bg-[#06C755] flex items-center justify-center flex-shrink-0">
            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[9px] border-l-white ml-0.5" />
          </div>
          <div className="flex-1">
            <div className="h-1 bg-gray-200 rounded-full">
              <div className="h-1 bg-[#06C755] rounded-full w-0" />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">{Math.floor(message.duration / 1000)}s</p>
          </div>
        </div>
      )

    case 'location':
      return (
        <div className="bg-white rounded-2xl rounded-bl-sm overflow-hidden shadow-sm max-w-[240px]">
          <div className="w-60 h-32 bg-green-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div className="p-3">
            <p className="text-sm font-medium">{message.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{message.address}</p>
          </div>
        </div>
      )

    case 'imagemap':
      return (
        <div className="rounded-2xl rounded-bl-sm overflow-hidden shadow-sm max-w-[240px]">
          <div className="relative bg-gray-200" style={{ aspectRatio: `${message.baseSize.width} / ${message.baseSize.height}` }}>
            <SafeImage
              src={`${message.baseUrl}/1040`}
              alt={message.altText}
              className="w-full h-full object-cover"
              fallback={<div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>}
            />
            {message.actions.map((action, i) => {
              const scaleX = 100 / message.baseSize.width
              const scaleY = 100 / message.baseSize.height
              return (
                <div
                  key={i}
                  className="absolute border border-dashed border-white/50 bg-white/10"
                  style={{
                    left: `${action.area.x * scaleX}%`,
                    top: `${action.area.y * scaleY}%`,
                    width: `${action.area.width * scaleX}%`,
                    height: `${action.area.height * scaleY}%`,
                  }}
                />
              )
            })}
            {message.actions.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">
                Imagemap
              </div>
            )}
          </div>
        </div>
      )

    case 'template':
      return <TemplatePreview template={message.template} />

    case 'flex':
      return <FlexRenderer container={message.contents} />

    case 'coupon':
      return (
        <div className="bg-white rounded-2xl rounded-bl-sm overflow-hidden shadow-sm max-w-[240px]">
          <div className="bg-[#06C755] px-4 py-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <span className="text-white text-sm font-bold">クーポン</span>
          </div>
          <div className="p-3 space-y-1.5">
            <div>
              <p className="text-[10px] text-gray-400">Coupon ID</p>
              <p className="text-xs font-mono text-gray-700 break-all">{message.couponId || '(未設定)'}</p>
            </div>
            {message.deliveryTag && (
              <div>
                <p className="text-[10px] text-gray-400">Delivery Tag</p>
                <p className="text-xs text-gray-600">{message.deliveryTag}</p>
              </div>
            )}
          </div>
          <div className="border-t border-gray-100 px-4 py-2.5 text-center">
            <span className="text-[#06C755] text-sm font-medium">クーポンを確認</span>
          </div>
        </div>
      )

    default:
      return (
        <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
          <p className="text-sm text-gray-500">Unsupported message type</p>
        </div>
      )
  }
}

function TemplatePreview({ template }: { template: ButtonsTemplate | ConfirmTemplate | CarouselTemplate | ImageCarouselTemplate }) {
  switch (template.type) {
    case 'buttons': {
      const t = template as ButtonsTemplate
      return (
        <div className="bg-white rounded-2xl rounded-bl-sm overflow-hidden shadow-sm max-w-[240px]">
          {t.thumbnailImageUrl && (
            <SafeImage src={t.thumbnailImageUrl} alt="" className="w-full h-32 object-cover" fallback={null} />
          )}
          <div className="p-3">
            {t.title && <p className="text-sm font-bold">{t.title}</p>}
            <p className="text-xs text-gray-600 mt-1">{t.text}</p>
          </div>
          <div className="border-t border-gray-100">
            {t.actions.map((action, i) => (
              <button key={i} type="button" className="w-full py-2.5 text-[#06C755] text-sm font-medium border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                {action.label || action.type}
              </button>
            ))}
          </div>
        </div>
      )
    }
    case 'confirm': {
      const t = template as ConfirmTemplate
      return (
        <div className="bg-white rounded-2xl rounded-bl-sm overflow-hidden shadow-sm max-w-[240px]">
          <div className="p-3">
            <p className="text-xs text-gray-600">{t.text}</p>
          </div>
          <div className="border-t border-gray-100 flex">
            {t.actions.map((action, i) => (
              <button key={i} type="button" className="flex-1 py-2.5 text-[#06C755] text-sm font-medium border-r border-gray-100 last:border-r-0 hover:bg-gray-50">
                {action.label || action.type}
              </button>
            ))}
          </div>
        </div>
      )
    }
    case 'carousel': {
      const t = template as CarouselTemplate
      return (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {t.columns.map((col, i) => (
            <div key={i} className="flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm" style={{ width: '200px' }}>
              {col.thumbnailImageUrl && (
                <SafeImage src={col.thumbnailImageUrl} alt="" className="w-full h-24 object-cover" fallback={null} />
              )}
              <div className="p-3">
                {col.title && <p className="text-xs font-bold">{col.title}</p>}
                <p className="text-xs text-gray-600 mt-0.5">{col.text}</p>
              </div>
              <div className="border-t border-gray-100">
                {col.actions.map((action, ai) => (
                  <button key={ai} type="button" className="w-full py-2 text-[#06C755] text-xs font-medium border-b border-gray-100 last:border-b-0">
                    {action.label || action.type}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }
    case 'image_carousel': {
      const t = template as ImageCarouselTemplate
      return (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {t.columns.map((col, i) => (
            <div key={i} className="flex-shrink-0 rounded-2xl overflow-hidden shadow-sm" style={{ width: '160px' }}>
              <SafeImage
                src={col.imageUrl}
                alt=""
                className="w-full h-40 object-cover bg-gray-200"
                fallback={<div className="w-full h-40 bg-gray-200 flex items-center justify-center text-xs text-gray-500">No Image</div>}
              />
            </div>
          ))}
        </div>
      )
    }
    default:
      return <div className="bg-white rounded-2xl px-4 py-2.5 shadow-sm text-sm text-gray-500">Template</div>
  }
}
