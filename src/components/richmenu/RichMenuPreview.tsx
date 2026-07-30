import type { RichMenuPayload } from '../../types/richmenu'

const getTabCount = (areas: RichMenuPayload['areas']) => {
  if (areas.length < 2 || areas.some(({ bounds }) => bounds.y !== 0 || bounds.height <= 0)) return 0
  const totalWidth = areas.reduce((sum, { bounds }) => sum + bounds.width, 0)
  return Math.abs(totalWidth - 2500) <= areas.length ? areas.length : 0
}

export default function RichMenuPreview({ menu, imageUrl }: { menu: RichMenuPayload; imageUrl: string }) {
  const { width, height } = menu.size
  const tabCount = getTabCount(menu.areas)
  const tabLayout = tabCount >= 2
  return (
    <div className="mx-auto w-full max-w-[330px] overflow-hidden rounded-[2rem] border-[8px] border-slate-800 bg-[#7494C0] shadow-xl">
      <div className="flex items-center gap-2 bg-[#06C755] px-4 py-3 text-white"><div className="h-7 w-7 rounded-full bg-white/20" /><span className="text-xs font-medium">Bot Preview</span></div>
      <div className="flex min-h-[280px] items-end bg-[#7494C0] p-3">
        <div className="w-full overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="relative bg-slate-200" style={{ aspectRatio: `${width} / ${height}` }}>
            {imageUrl ? <img src={imageUrl} alt="Rich menu" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-slate-400">Menu image preview</div>}
            {menu.areas.map((area, index) => <div key={index} className={`absolute border-2 ${tabLayout ? 'border-amber-300 border-dashed bg-amber-400/35' : 'border-white/80 bg-[#06C755]/25'}`} style={{ left: `${area.bounds.x / width * 100}%`, top: `${area.bounds.y / height * 100}%`, width: `${area.bounds.width / width * 100}%`, height: `${area.bounds.height / height * 100}%` }}>
              <span className={`m-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${tabLayout ? 'bg-amber-600' : 'bg-slate-900/70'}`}>{index + 1}</span>
              {tabLayout && <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-slate-900/75 px-1.5 py-0.5 text-[8px] font-semibold text-white">タブ{index + 1}</span>}
            </div>)}
          </div>
          <div className="border-t border-slate-200 px-3 py-2 text-center text-[10px] text-slate-500">{menu.chatBarText}</div>
        </div>
      </div>
    </div>
  )
}
