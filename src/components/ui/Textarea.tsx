import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'
export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={cn('min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-[#06C755] focus:ring-2 focus:ring-emerald-100', className)} {...props} /> }
