import * as Primitive from '@radix-ui/react-alert-dialog'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/utils'
export const AlertDialog = Primitive.Root
export const AlertDialogTrigger = Primitive.Trigger
export const AlertDialogCancel = Primitive.Cancel
export const AlertDialogAction = Primitive.Action
export const AlertDialogContent = ({ className, ...props }: ComponentPropsWithoutRef<typeof Primitive.Content>) => <Primitive.Portal><Primitive.Overlay className="fixed inset-0 z-50 bg-slate-900/40" /><Primitive.Content className={cn('fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl', className)} {...props} /></Primitive.Portal>
export const AlertDialogHeader = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => <div className={cn('space-y-2', className)} {...props} />
export const AlertDialogTitle = Primitive.Title
export const AlertDialogDescription = Primitive.Description
export const AlertDialogFooter = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => <div className={cn('mt-6 flex justify-end gap-2', className)} {...props} />
