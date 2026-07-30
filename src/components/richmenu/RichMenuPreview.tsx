import type { RichMenuPayload } from '../../types/richmenu'

export default function RichMenuPreview({ menu, imageUrl }: { menu: RichMenuPayload; imageUrl: string }) {
  const { width, height } = menu.size
  return (
    <div className="mx-auto w-full max-w-[330px] overflow-hidden rounded-[2rem] border-[8px] border-slate-800 bg-[#7494C0] shadow-xl">
      <div className="flex items-center gap-2 bg-[#06C755] px-4 py-3 text-white"><div className="h-7 w-7 rounded-full bg-white/20" /><span className="text-xs font-medium">Bot Preview</span></div>
      <div className="flex min-h-[280px] items-end bg-[#7494C0] p-3">
        <div className="w-full overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="relative bg-slate-200" style={{ aspectRatio: `${width} / ${height}` }}>
            {imageUrl ? <img src={imageUrl} alt="Rich menu" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-slate-400">Menu image preview</div>}
            {menu.areas.map((area, index) => <div key={index} className="absolute border-2 border-white/80 bg-[#06C755]/25" style={{ left: `${area.bounds.x / width * 100}%`, top: `${area.bounds.y / height * 100}%`, width: `${area.bounds.width / width * 100}%`, height: `${area.bounds.height / height * 100}%` }}><span className="m-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/70 text-[10px] font-bold text-white">{index + 1}</span></div>)}
          </div>
          <div className="border-t border-slate-200 px-3 py-2 text-center text-[10px] text-slate-500">{menu.chatBarText}</div>
        </div>
      </div>
    </div>
  )
}
