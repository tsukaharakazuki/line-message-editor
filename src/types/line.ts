// LINE Messaging API Message Types

// --- Actions ---
export type Action =
  | URIAction
  | MessageAction
  | PostbackAction
  | DatetimePickerAction
  | CameraAction
  | CameraRollAction
  | LocationAction
  | RichMenuSwitchAction

export interface URIAction {
  type: 'uri'
  label?: string
  uri: string
}

export interface MessageAction {
  type: 'message'
  label?: string
  text: string
}

export interface PostbackAction {
  type: 'postback'
  label?: string
  data: string
  displayText?: string
}

export interface DatetimePickerAction {
  type: 'datetimepicker'
  label?: string
  data: string
  mode: 'date' | 'time' | 'datetime'
  initial?: string
  max?: string
  min?: string
}

export interface CameraAction {
  type: 'camera'
  label?: string
}

export interface CameraRollAction {
  type: 'cameraRoll'
  label?: string
}

export interface LocationAction {
  type: 'location'
  label?: string
}

export interface RichMenuSwitchAction {
  type: 'richmenuswitch'
  label?: string
  richMenuAliasId: string
  data: string
}

// --- Quick Reply ---
export interface QuickReplyItem {
  type: 'action'
  imageUrl?: string
  action: Action
}

export interface QuickReply {
  items: QuickReplyItem[]
}

// --- Messages ---
export interface TextMessage {
  type: 'text'
  text: string
  emojis?: Array<{
    index: number
    productId: string
    emojiId: string
  }>
  quoteToken?: string
  quickReply?: QuickReply
}

export interface StickerMessage {
  type: 'sticker'
  packageId: string
  stickerId: string
  quickReply?: QuickReply
}

export interface ImageMessage {
  type: 'image'
  originalContentUrl: string
  previewImageUrl: string
  quickReply?: QuickReply
}

export interface VideoMessage {
  type: 'video'
  originalContentUrl: string
  previewImageUrl: string
  trackingId?: string
  quickReply?: QuickReply
}

export interface AudioMessage {
  type: 'audio'
  originalContentUrl: string
  duration: number
  quickReply?: QuickReply
}

export interface LocationMessage {
  type: 'location'
  title: string
  address: string
  latitude: number
  longitude: number
  quickReply?: QuickReply
}

// --- Imagemap ---
export interface ImagemapArea {
  x: number
  y: number
  width: number
  height: number
}

export interface ImagemapURIAction {
  type: 'uri'
  linkUri: string
  area: ImagemapArea
  label?: string
}

export interface ImagemapMessageAction {
  type: 'message'
  text: string
  area: ImagemapArea
  label?: string
}

export type ImagemapAction = ImagemapURIAction | ImagemapMessageAction

export interface ImagemapMessage {
  type: 'imagemap'
  baseUrl: string
  altText: string
  baseSize: {
    width: number
    height: number
  }
  actions: ImagemapAction[]
  quickReply?: QuickReply
}

// --- Template ---
export interface ButtonsTemplate {
  type: 'buttons'
  thumbnailImageUrl?: string
  imageAspectRatio?: 'rectangle' | 'square'
  imageSize?: 'cover' | 'contain'
  imageBackgroundColor?: string
  title?: string
  text: string
  defaultAction?: Action
  actions: Action[]
}

export interface ConfirmTemplate {
  type: 'confirm'
  text: string
  actions: [Action, Action]
}

export interface CarouselColumn {
  thumbnailImageUrl?: string
  imageBackgroundColor?: string
  title?: string
  text: string
  defaultAction?: Action
  actions: Action[]
}

export interface CarouselTemplate {
  type: 'carousel'
  columns: CarouselColumn[]
  imageAspectRatio?: 'rectangle' | 'square'
  imageSize?: 'cover' | 'contain'
}

export interface ImageCarouselColumn {
  imageUrl: string
  action: Action
}

export interface ImageCarouselTemplate {
  type: 'image_carousel'
  columns: ImageCarouselColumn[]
}

export type Template = ButtonsTemplate | ConfirmTemplate | CarouselTemplate | ImageCarouselTemplate

export interface TemplateMessage {
  type: 'template'
  altText: string
  template: Template
  quickReply?: QuickReply
}

// --- Flex Message ---
export interface FlexMessage {
  type: 'flex'
  altText: string
  contents: FlexContainer
  quickReply?: QuickReply
}

export type FlexContainer = FlexBubble | FlexCarousel

export interface FlexBubble {
  type: 'bubble'
  size?: 'nano' | 'micro' | 'kilo' | 'mega' | 'giga'
  direction?: 'ltr' | 'rtl'
  header?: FlexBox
  hero?: FlexComponent
  body?: FlexBox
  footer?: FlexBox
  styles?: FlexBubbleStyle
  action?: Action
}

export interface FlexCarousel {
  type: 'carousel'
  contents: FlexBubble[]
}

export interface FlexBubbleStyle {
  header?: FlexBlockStyle
  hero?: FlexBlockStyle
  body?: FlexBlockStyle
  footer?: FlexBlockStyle
}

export interface FlexBlockStyle {
  backgroundColor?: string
  separator?: boolean
  separatorColor?: string
}

export type FlexComponent = FlexBox | FlexButton | FlexImage | FlexText | FlexIcon | FlexSeparator | FlexFiller | FlexSpan

export interface FlexBox {
  type: 'box'
  layout: 'horizontal' | 'vertical' | 'baseline'
  contents: FlexComponent[]
  backgroundColor?: string
  borderColor?: string
  borderWidth?: string
  cornerRadius?: string
  width?: string
  height?: string
  flex?: number
  spacing?: string
  margin?: string
  paddingAll?: string
  paddingTop?: string
  paddingBottom?: string
  paddingStart?: string
  paddingEnd?: string
  action?: Action
  justifyContent?: string
  alignItems?: string
}

export interface FlexButton {
  type: 'button'
  action: Action
  flex?: number
  margin?: string
  height?: 'sm' | 'md'
  style?: 'link' | 'primary' | 'secondary'
  color?: string
  gravity?: 'top' | 'bottom' | 'center'
}

export interface FlexImage {
  type: 'image'
  url: string
  flex?: number
  margin?: string
  size?: string
  aspectRatio?: string
  aspectMode?: 'cover' | 'fit'
  backgroundColor?: string
  action?: Action
}

export interface FlexText {
  type: 'text'
  text: string
  flex?: number
  margin?: string
  size?: string
  align?: 'start' | 'end' | 'center'
  gravity?: 'top' | 'bottom' | 'center'
  wrap?: boolean
  weight?: 'regular' | 'bold'
  color?: string
  decoration?: 'none' | 'underline' | 'line-through'
  maxLines?: number
  action?: Action
  contents?: FlexSpan[]
}

export interface FlexIcon {
  type: 'icon'
  url: string
  margin?: string
  size?: string
  aspectRatio?: string
}

export interface FlexSeparator {
  type: 'separator'
  margin?: string
  color?: string
}

export interface FlexFiller {
  type: 'filler'
  flex?: number
}

export interface FlexSpan {
  type: 'span'
  text: string
  size?: string
  color?: string
  weight?: 'regular' | 'bold'
  style?: 'normal' | 'italic'
  decoration?: 'none' | 'underline' | 'line-through'
}

// --- Coupon Message ---
export interface CouponMessage {
  type: 'coupon'
  couponId: string
  deliveryTag?: string
  quickReply?: QuickReply
}

// --- Union of all message types ---
export type LineMessage =
  | TextMessage
  | StickerMessage
  | ImageMessage
  | VideoMessage
  | AudioMessage
  | LocationMessage
  | ImagemapMessage
  | TemplateMessage
  | FlexMessage
  | CouponMessage

export type MessageType = LineMessage['type']

export const MESSAGE_TYPE_LABELS: Record<MessageType, string> = {
  text: 'Text',
  sticker: 'Sticker',
  image: 'Image',
  video: 'Video',
  audio: 'Audio',
  location: 'Location',
  imagemap: 'Imagemap',
  template: 'Template',
  flex: 'Flex Message',
  coupon: 'Coupon',
}

export type TemplateType = Template['type']

export const TEMPLATE_TYPE_LABELS: Record<TemplateType, string> = {
  buttons: 'Buttons',
  confirm: 'Confirm',
  carousel: 'Carousel',
  image_carousel: 'Image Carousel',
}
