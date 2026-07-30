import type { Action } from '../types/line'
import type { RichMenuBounds, RichMenuPayload, SavedRichMenu } from '../types/richmenu'
import { RICH_MENU_SIZES } from '../types/richmenu'

export function defaultRichMenuPayload(): RichMenuPayload {
  return {
    size: RICH_MENU_SIZES.full,
    selected: false,
    name: 'Rich menu',
    chatBarText: 'Menu',
    areas: [],
  }
}

export function defaultRichMenuArea(bounds: RichMenuBounds): { bounds: RichMenuBounds; action: Action } {
  return { bounds, action: { type: 'uri', label: '', uri: 'https://example.com' } }
}

export function createSavedRichMenu(payload = defaultRichMenuPayload()): SavedRichMenu {
  const now = new Date().toISOString()
  return { id: crypto.randomUUID(), createdAt: now, updatedAt: now, imageUrl: '', richMenu: payload }
}
