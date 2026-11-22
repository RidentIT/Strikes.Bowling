import { ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  /** Short supporting line, e.g. "of 12 lanes". */
  hint: string
  href: string
  /** Colour classes for the icon tile. */
  tone: string
}

/** A headline figure that links to the page where staff can act on it. */
export function StatCard({ label, value, icon: Icon, hint, href, tone }: StatCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-border bg-surface p-4 transition-colors sm:p-5 hover:border-white/12 hover:bg-[#171c30]"
    >
      <div className="flex items-start justify-between">
        <span className={`flex size-9 items-center justify-center rounded-lg ${tone}`}>
          <Icon aria-hidden className="size-4.5" />
        </span>
        <ArrowUpRight
          aria-hidden
          className="size-4 text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      </div>
      <p className="mt-3 text-h1 font-bold tabular-nums sm:mt-4 sm:text-display">{value}</p>
      <p className="mt-0.5 text-body-sm font-medium">{label}</p>
      <p className="text-caption text-muted">{hint}</p>
    </Link>
  )
}
