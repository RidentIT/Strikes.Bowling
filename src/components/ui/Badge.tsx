import type { ReactNode } from 'react'

type BadgeTone = 'success' | 'info' | 'warning' | 'danger'

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: 'border-brand-emerald/25 bg-brand-emerald/10 text-brand-emerald',
  info: 'border-brand-cyan/25 bg-brand-cyan/10 text-brand-cyan',
  warning: 'border-brand-orange/25 bg-brand-orange/10 text-brand-orange',
  danger: 'border-brand-rose/25 bg-brand-rose/10 text-brand-rose',
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
