import type {
  TextMessage,
  StickerMessage,
  ImageMessage,
  VideoMessage,
  AudioMessage,
  LocationMessage,
  ImagemapMessage,
  TemplateMessage,
  FlexMessage,
  LineMessage,
} from '../types/line'

export function defaultTextMessage(): TextMessage {
  return { type: 'text', text: 'Hello, World!' }
}

export function defaultStickerMessage(): StickerMessage {
  return { type: 'sticker', packageId: '446', stickerId: '1988' }
}

export function defaultImageMessage(): ImageMessage {
  return {
    type: 'image',
    originalContentUrl: 'https://example.com/image.jpg',
    previewImageUrl: 'https://example.com/image_preview.jpg',
  }
}

export function defaultVideoMessage(): VideoMessage {
  return {
    type: 'video',
    originalContentUrl: 'https://example.com/video.mp4',
    previewImageUrl: 'https://example.com/video_preview.jpg',
  }
}

export function defaultAudioMessage(): AudioMessage {
  return {
    type: 'audio',
    originalContentUrl: 'https://example.com/audio.m4a',
    duration: 60000,
  }
}

export function defaultLocationMessage(): LocationMessage {
  return {
    type: 'location',
    title: 'Tokyo Station',
    address: '1 Chome Marunouchi, Chiyoda City, Tokyo',
    latitude: 35.6812,
    longitude: 139.7671,
  }
}

export function defaultImagemapMessage(): ImagemapMessage {
  return {
    type: 'imagemap',
    baseUrl: 'https://example.com/imagemap',
    altText: 'Imagemap message',
    baseSize: { width: 1040, height: 1040 },
    actions: [],
  }
}

export function defaultTemplateMessage(): TemplateMessage {
  return {
    type: 'template',
    altText: 'Template message',
    template: {
      type: 'buttons',
      text: 'Please select',
      actions: [
        { type: 'message', label: 'Option 1', text: 'option1' },
      ],
    },
  }
}

export function defaultFlexMessage(): FlexMessage {
  return {
    type: 'flex',
    altText: 'Flex message',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'Hello, World!',
            weight: 'bold',
            size: 'xl',
          },
        ],
      },
    },
  }
}

export function defaultMessage(type: LineMessage['type']): LineMessage {
  switch (type) {
    case 'text': return defaultTextMessage()
    case 'sticker': return defaultStickerMessage()
    case 'image': return defaultImageMessage()
    case 'video': return defaultVideoMessage()
    case 'audio': return defaultAudioMessage()
    case 'location': return defaultLocationMessage()
    case 'imagemap': return defaultImagemapMessage()
    case 'template': return defaultTemplateMessage()
    case 'flex': return defaultFlexMessage()
  }
}
