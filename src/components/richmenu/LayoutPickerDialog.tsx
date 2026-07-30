import { useState } from 'react'
import { Check, Grid2X2 } from 'lucide-react'
import type { RichMenuBounds } from '../../types/richmenu'
import { RICH_MENU_LAYOUTS } from '../../data/richMenuLayouts'
import { Button } from '../ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog'

export default function LayoutPickerDialog({ width, height, onSelect }: { width: number; height: number; onSelect: (areas: RichMenuBounds[]) => void }) {
  const [open, setOpen] = useState(false)
  const choose = (id: string) => { const preset = RICH_MENU_LAYOUTS.find((item) => item.id === id); if (!preset) return; onSelect(preset.getAreas(width, height)); setOpen(false) }
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button type="button" variant="outline"><Grid2X2 className="mr-2 h-4 w-4" /> レイアウトを選択</Button></DialogTrigger><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>レイアウトを選択</DialogTitle></DialogHeader><div className="grid grid-cols-4 gap-3">{RICH_MENU_LAYOUTS.map((preset) => <button key={preset.id} type="button" onClick={() => choose(preset.id)} className="group rounded-xl border border-slate-200 p-3 text-left hover:border-[#06C755] hover:bg-emerald-50"><div className="mb-2 flex aspect-[5/3] items-center justify-center rounded-lg bg-slate-100"><Check className="h-5 w-5 text-slate-300 group-hover:text-[#06C755]" /></div><p className="text-xs font-medium">{preset.label}</p></button>)}</div></DialogContent></Dialog>
}
