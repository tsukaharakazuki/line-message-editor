import * as Primitive from '@radix-ui/react-dropdown-menu'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/utils'
export const DropdownMenu = Primitive.Root
export const DropdownMenuTrigger = Primitive.Trigger
export const DropdownMenuContent = ({ className, ...props }: ComponentPropsWithoutRef<typeof Primitive.Content>) => <Primitive.Portal><Primitive.Content className={cn('z-50 min-w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-lg', className)} {...props} /></Primitive.Portal>
export const DropdownMenuItem = ({ className, ...props }: ComponentPropsWithoutRef<typeof Primitive.Item>) => <Primitive.Item className={cn('cursor-pointer rounded-lg px-3 py-2 text-xs outline-none hover:bg-slate-100', className)} {...props} />
