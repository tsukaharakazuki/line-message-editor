import { ExternalLink, LayoutGrid, MessageSquare } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#06C755] text-white shadow-sm"><MessageSquare className="h-5 w-5" /></div>
          <div><p className="text-sm font-bold tracking-tight">LINE Editor</p><p className="text-[11px] text-slate-400">Message Studio</p></div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
          <NavLink to="/messages" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-emerald-50 text-[#06C755]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}><MessageSquare className="h-5 w-5" /> メッセージ</NavLink>
          <NavLink to="/rich-menus" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-emerald-50 text-[#06C755]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}><LayoutGrid className="h-5 w-5" /> リッチメニュー</NavLink>
        </nav>
        <div className="border-t border-slate-100 p-4"><a className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-700" href="https://developers.line.biz/en/docs/messaging-api/message-types/" target="_blank" rel="noopener noreferrer">LINE API Docs <ExternalLink className="h-3.5 w-3.5" /></a></div>
      </aside>
      <div className="lg:pl-64">
        <header className="flex h-14 items-center border-b border-slate-200 bg-white px-5 lg:hidden"><div className="flex items-center gap-2 text-sm font-bold"><div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#06C755] text-white"><MessageSquare className="h-4 w-4" /></div>LINE Editor</div></header>
        <main className="mx-auto max-w-[1600px]"><Outlet /></main>
      </div>
    </div>
  )
}
