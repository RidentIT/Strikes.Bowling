import type { ReactNode } from 'react'

type BadgeTone = 'success' | 'info' | 'warning' | 'danger'

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: 'border-brand-green/25 bg-brand-green/10 text-brand-green',
  info: 'border-brand-cyan/25 bg-brand-cyan/10 text-brand-cyan',
  warning: 'border-brand-yellow/25 bg-brand-yellow/10 text-brand-yellow',
  danger: 'border-brand-red/25 bg-brand-red/10 text-brand-red',
}

interface BadgeProps {
  tone: BadgeTone
  children: ReactNode
}

export function Badge({ tone, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-caption font-semibold ${TONE_CLASSES[tone]}`}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  )
}
