import { useCallback } from 'react'
import type { RichMenuPayload, SavedRichMenu } from '../types/richmenu'
import { useLocalStorage } from './useLocalStorage'
import { createSavedRichMenu } from '../utils/richMenuTemplates'

const STORAGE_KEY = 'line-richmenu-editor-v1'

export function useSavedRichMenus() {
  const [menus, setMenus] = useLocalStorage<SavedRichMenu[]>(STORAGE_KEY, [])

  const create = useCallback((payload?: RichMenuPayload) => {
    const menu = createSavedRichMenu(payload)
    setMenus((prev) => [...prev, menu])
    return menu
  }, [setMenus])

  const update = useCallback((id: string, patch: Partial<SavedRichMenu>) => {
    setMenus((prev) => prev.map((menu) => menu.id === id
      ? { ...menu, ...patch, updatedAt: new Date().toISOString() }
      : menu))
  }, [setMenus])

  const remove = useCallback((id: string) => {
    setMenus((prev) => prev.filter((menu) => menu.id !== id))
  }, [setMenus])

  const duplicate = useCallback((id: string) => {
    let duplicateMenu: SavedRichMenu | undefined
    setMenus((prev) => {
      const source = prev.find((menu) => menu.id === id)
      if (!source) return prev
      const now = new Date().toISOString()
      duplicateMenu = { ...structuredClone(source), id: crypto.randomUUID(), createdAt: now, updatedAt: now,
        richMenu: { ...source.richMenu, name: `${source.richMenu.name} (Copy)` } }
      return [...prev, duplicateMenu]
    })
    return duplicateMenu
  }, [setMenus])

  return { menus, create, update, remove, duplicate }
}
