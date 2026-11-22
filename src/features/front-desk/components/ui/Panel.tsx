import type { ReactNode } from 'react'

interface PanelProps {
  title?: string
  description?: string
  /** Controls at the right of the header, e.g. a "View all" link. */
  action?: ReactNode
  children: ReactNode
  className?: string
  /** Remove body padding, e.g. for full-width tables and lists. */
  flush?: boolean
}

/** The standard card surface. */
export function Panel({ title, description, action, children, className = '', flush = false }: PanelProps) {
  return (
    <section className={`rounded-xl border border-border bg-surface ${className}`}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-body font-semibold">{title}</h2>}
            {description && <p className="mt-0.5 text-caption text-muted">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={flush ? '' : 'p-5'}>{children}</div>
    </section>
  )
}
