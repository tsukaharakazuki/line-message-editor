import type { RichMenuBounds } from '../types/richmenu'

export interface RichMenuLayoutPreset {
  id: string
  label: string
  getAreas: (width: number, height: number) => RichMenuBounds[]
}

const grid = (columns: number, rows: number) => (width: number, height: number): RichMenuBounds[] => {
  const cw = width / columns
  const ch = height / rows
  return Array.from({ length: rows * columns }, (_, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    return { x: Math.round(column * cw), y: Math.round(row * ch), width: Math.round(column === columns - 1 ? width - column * cw : cw), height: Math.round(row === rows - 1 ? height - row * ch : ch) }
  })
}

export const RICH_MENU_LAYOUTS: RichMenuLayoutPreset[] = [
  { id: 'full', label: '1分割', getAreas: grid(1, 1) },
  { id: 'columns-2', label: '2列', getAreas: grid(2, 1) },
  { id: 'rows-2', label: '2段', getAreas: grid(1, 2) },
  { id: 'grid-2x2', label: '2×2', getAreas: grid(2, 2) },
  { id: 'columns-3', label: '3列', getAreas: grid(3, 1) },
  { id: 'grid-3x2', label: '3×2', getAreas: grid(3, 2) },
  { id: 'grid-4x2', label: '4×2', getAreas: grid(4, 2) },
  { id: 'grid-3x3', label: '3×3', getAreas: grid(3, 3) },
  // LINEのrichmenuswitchは、タブごとに別リッチメニューを表示し、各画像の全高をタブ領域として使う。
  { id: 'tab-columns-2', label: '切替タブ 2枚', getAreas: grid(2, 1) },
  { id: 'tab-columns-3', label: '切替タブ 3枚', getAreas: grid(3, 1) },
  { id: 'tab-columns-4', label: '切替タブ 4枚', getAreas: grid(4, 1) },
]
