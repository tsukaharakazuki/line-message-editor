import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={cn('h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#06C755] focus:ring-2 focus:ring-emerald-100', className)} {...props} /> }
