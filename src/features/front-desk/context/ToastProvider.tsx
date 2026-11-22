'use client'

import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'
import { createContext, use, useCallback, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export type ToastTone = 'success' | 'error' | 'info'

export interface ToastInput {
  tone: ToastTone
  title: string
  description?: string
}

interface Toast extends ToastInput {
  id: number
}

const TOAST_DURATION_MS = 5000
const MAX_TOASTS = 4

const TONES = {
  success: { icon: CircleCheck, className: 'text-emerald-400' },
  error: { icon: CircleAlert, className: 'text-rose-400' },
  info: { icon: Info, className: 'text-sky-300' },
} satisfies Record<ToastTone, { icon: typeof Info; className: string }>

const ToastContext = createContext<((toast: ToastInput) => void) | null>(null)

/** Short confirmation and error messages for staff actions. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback(
    (toast: ToastInput) => {
      nextId.current += 1
      const id = nextId.current
      setToasts((current) => [...current.slice(-(MAX_TOASTS - 1)), { ...toast, id }])
      window.setTimeout(() => dismiss(id), TOAST_DURATION_MS)
    },
    [dismiss],
  )

  return (
    <ToastContext value={notify}>
      {children}
      <section
        aria-label="Notifications"
        aria-live="polite"
        className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const { icon: Icon, className } = TONES[toast.tone]
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                role={toast.tone === 'error' ? 'alert' : 'status'}
                className="pointer-events-auto flex items-start gap-3 rounded-lg border border-border bg-surface-raised p-3.5 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.7)]"
              >
                <Icon aria-hidden className={`mt-0.5 size-4.5 shrink-0 ${className}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm font-semibold">{toast.title}</p>
                  {toast.description && <p className="mt-0.5 text-caption text-secondary">{toast.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Dismiss notification"
                  className="-m-1 rounded-md p-1 text-muted transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </section>
    </ToastContext>
  )
}

export function useToast(): (toast: ToastInput) => void {
  const notify = use(ToastContext)
  if (!notify) throw new Error('useToast must be used inside ToastProvider.')
  return notify
}
