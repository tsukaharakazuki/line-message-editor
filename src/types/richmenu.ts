import type { Action } from './line'

export type RichMenuSize = 'full' | 'half'

export const RICH_MENU_SIZES: Record<RichMenuSize, { width: number; height: number }> = {
  full: { width: 2500, height: 1686 },
  half: { width: 2500, height: 843 },
}

export interface RichMenuBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface RichMenuArea {
  bounds: RichMenuBounds
  action: Action
}

export interface RichMenuPayload {
  size: { width: number; height: number }
  selected: boolean
  name: string
  chatBarText: string
  areas: RichMenuArea[]
}

export interface SavedRichMenu {
  id: string
  createdAt: string
  updatedAt: string
  deliveryStartAt?: string
  deliveryEndAt?: string
  memo?: string
  imageUrl: string
  richMenu: RichMenuPayload
}
