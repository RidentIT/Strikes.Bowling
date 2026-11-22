import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  /** Small line above the title, e.g. today's date. */
  eyebrow?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, eyebrow, actions }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 lg:mb-8">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1.5 text-caption font-medium text-muted">{eyebrow}</p>}
        <h1 className="text-h1">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-body-sm text-secondary">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}
