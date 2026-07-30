import { Check } from "lucide-react"
import type { RichMenuBounds } from "../../types/richmenu"
import { RICH_MENU_LAYOUTS } from "../../data/richMenuLayouts"

interface Props { width: number; height: number; selectedId?: string; onSelect: (areas: RichMenuBounds[], id: string) => void }

const isTabLayout = (id: string) => id.startsWith("tab-")

export default function LayoutPickerDialog({ width, height, selectedId, onSelect }: Props) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
    {RICH_MENU_LAYOUTS.map((preset) => {
      const areas = preset.getAreas(width, height)
      const tabLayout = isTabLayout(preset.id)
      return <button key={preset.id} type="button" onClick={() => onSelect(areas, preset.id)} className={`group rounded-xl border p-3 text-left transition ${selectedId === preset.id ? "border-[#06C755] bg-emerald-50 ring-2 ring-emerald-100" : "border-slate-200 bg-white hover:border-[#06C755] hover:bg-emerald-50/50"}`}>
        <div className="relative mb-3 aspect-[5/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 p-0.5">
          <div className="relative h-full w-full overflow-hidden rounded-md bg-slate-200">
            {areas.map((area, index) => <div key={index} className={`absolute border transition ${tabLayout && index === 0 ? "border-amber-300 border-dashed bg-amber-400/80 group-hover:bg-amber-400/95" : "border-white bg-[#06C755]/75 group-hover:bg-[#06C755]/90"}`} style={{ left: `${area.x / width * 100}%`, top: `${area.y / height * 100}%`, width: `${area.width / width * 100}%`, height: `${area.height / height * 100}%` }}>
              {tabLayout && index === 0 ? <span className="flex h-full flex-col items-center justify-center gap-0.5 text-[8px] font-bold leading-none text-white"><span>タブ</span><span className="text-[7px] font-normal">追加範囲</span></span> : <span className="flex h-full items-center justify-center text-[9px] font-bold text-white/90">{tabLayout ? index : index + 1}</span>}
            </div>)}
            {tabLayout && <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center"><span className="rounded-b bg-slate-900/75 px-1.5 py-0.5 text-[7px] font-semibold text-white">上部がタブ</span></div>}
          </div>
          {selectedId === preset.id && <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#06C755] shadow"><Check className="h-3.5 w-3.5" /></span>}
        </div>
        <p className="text-xs font-semibold text-slate-700">{preset.label}</p>
        <p className="mt-0.5 text-[10px] text-slate-400">{tabLayout ? "タブ1つ＋" : ""}{tabLayout ? areas.length - 1 : areas.length}エリア</p>
      </button>
    })}
  </div>
}
