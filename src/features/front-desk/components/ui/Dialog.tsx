'use client'

import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'

interface DialogProps {
  title: string
  description?: ReactNode
  onClose: () => void
  children?: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }

/**
 * Modal dialog on the native <dialog> element: focus is kept inside, the page
 * behind is inert, and Escape closes it. Mount it to open; unmount to close.
 * Give the element that should receive focus a `data-autofocus` attribute.
 */
export function Dialog({ title, description, onClose, children, footer, size = 'md' }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
    dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    return () => dialog.close()
  }, [])

  return (
    // Clicks on the backdrop land on the <dialog> itself; clicks inside land on its content.
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className={`m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] ${SIZES[size]} overflow-hidden rounded-xl border border-border bg-surface p-0 text-foreground shadow-[0_24px_64px_-16px_rgb(0_0_0/0.8)] backdrop:bg-[#04050c]/75`}
    >
      <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
        <header className="flex items-start justify-between gap-4 px-6 pt-5 pb-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-h3">
              {title}
            </h2>
            {description && (
              <div id={descriptionId} className="mt-1 text-body-sm text-secondary">
                {description}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 rounded-md p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <X aria-hidden className="size-4.5" />
          </button>
        </header>
        {children && <div className="overflow-y-auto px-6 pb-5">{children}</div>}
        {footer && (
          <footer className="flex flex-wrap justify-end gap-2 border-t border-border bg-background-raised/60 px-6 py-4">
            {footer}
          </footer>
        )}
      </div>
    </dialog>
  )
}
