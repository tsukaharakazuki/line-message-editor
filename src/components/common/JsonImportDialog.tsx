import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/Textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog'

interface Props<T> { open: boolean; title: string; placeholder?: string; onOpenChange: (open: boolean) => void; validate: (value: unknown) => T; onImport: (value: T) => void }
export default function JsonImportDialog<T>({ open, title, placeholder, onOpenChange, validate, onImport }: Props<T>) {
  const [text, setText] = useState(''); const [error, setError] = useState('')
  const handleImport = () => { try { const value = validate(JSON.parse(text)); onImport(value); setText(''); setError(''); onOpenChange(false); toast.success('JSONをインポートしました') } catch (cause) { const message = cause instanceof Error ? cause.message : 'JSONの形式が正しくありません'; setError(message); toast.error(message) } }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader><div className="mt-4 space-y-3"><Textarea value={text} onChange={(event) => { setText(event.target.value); setError('') }} placeholder={placeholder ?? '{\n  ...\n}'} className="min-h-64 font-mono text-xs" />{error && <p className="text-xs text-red-600">{error}</p>}<div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>キャンセル</Button><Button type="button" onClick={handleImport}>インポート</Button></div></div></DialogContent></Dialog>
}
