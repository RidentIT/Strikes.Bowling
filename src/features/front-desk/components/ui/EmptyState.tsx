import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  /** Smaller variant for use inside panels. */
  compact?: boolean
}

export function EmptyState({ icon: Icon, title, description, action, compact = false }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'px-4 py-8' : 'px-6 py-14'}`}>
      <span className="flex size-10 items-center justify-center rounded-full border border-border bg-surface-raised text-muted">
        <Icon aria-hidden className="size-4.5" />
      </span>
      <p className="mt-3 text-body-sm font-semibold">{title}</p>
      {description && <p className="mt-1 max-w-sm text-caption text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
