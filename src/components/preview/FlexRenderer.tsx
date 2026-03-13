import type { FlexContainer, FlexBubble, FlexComponent, FlexBox, FlexText, FlexImage, FlexButton, FlexIcon, FlexSeparator } from '../../types/line'

function renderComponent(component: FlexComponent, key: string | number): React.ReactNode {
  switch (component.type) {
    case 'box':
      return <FlexBoxRenderer key={key} box={component} />
    case 'text':
      return <FlexTextRenderer key={key} text={component} />
    case 'image':
      return <FlexImageRenderer key={key} image={component} />
    case 'button':
      return <FlexButtonRenderer key={key} button={component} />
    case 'icon':
      return <FlexIconRenderer key={key} icon={component} />
    case 'separator':
      return <FlexSeparatorRenderer key={key} separator={component} />
    case 'filler':
      return <div key={key} style={{ flex: component.flex ?? 1 }} />
    case 'span':
      return <span key={key} style={{ fontSize: component.size, color: component.color, fontWeight: component.weight }}>{component.text}</span>
    default:
      return null
  }
}

function spacingToPixels(spacing?: string): string {
  const map: Record<string, string> = {
    none: '0', xs: '2px', sm: '4px', md: '8px', lg: '12px', xl: '16px', xxl: '20px',
  }
  return map[spacing || ''] || spacing || '0'
}

function sizeToPixels(size?: string): string {
  const map: Record<string, string> = {
    xxs: '11px', xs: '12px', sm: '13px', md: '14px', lg: '16px', xl: '18px', xxl: '22px',
    '3xl': '26px', '4xl': '32px', '5xl': '40px',
  }
  return map[size || 'md'] || size || '14px'
}

function FlexBoxRenderer({ box }: { box: FlexBox }) {
  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: box.layout === 'horizontal' ? 'row' : box.layout === 'baseline' ? 'row' : 'column',
    alignItems: box.layout === 'baseline' ? 'baseline' : box.alignItems as React.CSSProperties['alignItems'],
    justifyContent: box.justifyContent as React.CSSProperties['justifyContent'],
    gap: spacingToPixels(box.spacing),
    backgroundColor: box.backgroundColor,
    borderColor: box.borderColor,
    borderWidth: box.borderWidth,
    borderRadius: box.cornerRadius,
    width: box.width,
    height: box.height,
    flex: box.flex,
    margin: box.margin ? spacingToPixels(box.margin) : undefined,
    padding: box.paddingAll ? spacingToPixels(box.paddingAll) : undefined,
    paddingTop: box.paddingTop ? spacingToPixels(box.paddingTop) : undefined,
    paddingBottom: box.paddingBottom ? spacingToPixels(box.paddingBottom) : undefined,
    paddingLeft: box.paddingStart ? spacingToPixels(box.paddingStart) : undefined,
    paddingRight: box.paddingEnd ? spacingToPixels(box.paddingEnd) : undefined,
  }
  return (
    <div style={style}>
      {box.contents.map((c, i) => renderComponent(c, i))}
    </div>
  )
}

function FlexTextRenderer({ text }: { text: FlexText }) {
  const style: React.CSSProperties = {
    fontSize: sizeToPixels(text.size),
    fontWeight: text.weight === 'bold' ? 700 : 400,
    color: text.color || '#111',
    textAlign: text.align as React.CSSProperties['textAlign'],
    flex: text.flex,
    margin: text.margin ? spacingToPixels(text.margin) : undefined,
    whiteSpace: text.wrap ? 'normal' : 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 1.4,
  }
  if (text.contents && text.contents.length > 0) {
    return (
      <p style={{ ...style, margin: style.margin || 0 }}>
        {text.contents.map((span, i) => renderComponent(span, i))}
      </p>
    )
  }
  return <p style={{ ...style, margin: style.margin || 0 }}>{text.text}</p>
}

function FlexImageRenderer({ image }: { image: FlexImage }) {
  const style: React.CSSProperties = {
    flex: image.flex,
    margin: image.margin ? spacingToPixels(image.margin) : undefined,
    backgroundColor: image.backgroundColor,
    width: '100%',
  }
  return (
    <div style={style}>
      <img
        src={image.url}
        alt=""
        style={{
          width: '100%',
          objectFit: image.aspectMode === 'cover' ? 'cover' : 'contain',
          aspectRatio: image.aspectRatio?.replace(':', '/'),
        }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
    </div>
  )
}

function FlexButtonRenderer({ button }: { button: FlexButton }) {
  const isPrimary = button.style === 'primary'
  const isLink = button.style === 'link'
  return (
    <button
      type="button"
      className="w-full rounded-lg text-sm font-medium py-2 px-4 transition-colors"
      style={{
        backgroundColor: isPrimary ? (button.color || '#06C755') : isLink ? 'transparent' : '#f0f0f0',
        color: isPrimary ? '#fff' : (button.color || '#06C755'),
        border: isLink ? 'none' : '1px solid #ddd',
        flex: button.flex,
        margin: button.margin ? spacingToPixels(button.margin) : undefined,
        height: button.height === 'sm' ? '32px' : '40px',
      }}
    >
      {button.action.label || button.action.type}
    </button>
  )
}

function FlexIconRenderer({ icon }: { icon: FlexIcon }) {
  return (
    <img
      src={icon.url}
      alt=""
      style={{
        width: sizeToPixels(icon.size),
        height: sizeToPixels(icon.size),
        margin: icon.margin ? spacingToPixels(icon.margin) : undefined,
      }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
    />
  )
}

function FlexSeparatorRenderer({ separator }: { separator: FlexSeparator }) {
  return (
    <hr style={{
      border: 'none',
      borderTop: `1px solid ${separator.color || '#ddd'}`,
      margin: separator.margin ? `${spacingToPixels(separator.margin)} 0` : '8px 0',
      width: '100%',
    }} />
  )
}

function BubbleRenderer({ bubble }: { bubble: FlexBubble }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm" style={{ maxWidth: '300px', width: '100%' }}>
      {bubble.header && (
        <div style={{ padding: '12px 16px', backgroundColor: bubble.styles?.header?.backgroundColor }}>
          <FlexBoxRenderer box={bubble.header} />
        </div>
      )}
      {bubble.hero && renderComponent(bubble.hero, 'hero')}
      {bubble.body && (
        <div style={{ padding: '16px', backgroundColor: bubble.styles?.body?.backgroundColor }}>
          <FlexBoxRenderer box={bubble.body} />
        </div>
      )}
      {bubble.footer && (
        <div style={{ padding: '12px 16px', backgroundColor: bubble.styles?.footer?.backgroundColor }}>
          <FlexBoxRenderer box={bubble.footer} />
        </div>
      )}
    </div>
  )
}

export default function FlexRenderer({ container }: { container: FlexContainer }) {
  if (container.type === 'bubble') {
    return <BubbleRenderer bubble={container} />
  }

  if (container.type === 'carousel') {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {container.contents.map((bubble, i) => (
          <div key={i} className="flex-shrink-0">
            <BubbleRenderer bubble={bubble} />
          </div>
        ))}
      </div>
    )
  }

  return <div className="text-sm text-gray-500">Unsupported flex type</div>
}
