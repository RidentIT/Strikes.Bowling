import { CalendarCheck, CalendarX, CircleCheck, Play, Sparkles, Square, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { formatAgo } from '../../lib/format'
import type { ActivityEntry, ActivityKind } from '../../types/front-desk.types'

const KIND_STYLES: Record<ActivityKind, { icon: LucideIcon; className: string }> = {
  'game-started': { icon: Play, className: 'text-emerald-300 bg-emerald-400/10' },
  'game-ended': { icon: Square, className: 'text-secondary bg-white/6' },
  'reservation-checked-in': { icon: CalendarCheck, className: 'text-indigo-300 bg-indigo-400/12' },
  'reservation-cancelled': { icon: CalendarX, className: 'text-amber-300 bg-amber-400/10' },
  'lane-cleaning': { icon: Sparkles, className: 'text-sky-300 bg-sky-400/10' },
  'lane-available': { icon: CircleCheck, className: 'text-emerald-300 bg-emerald-400/10' },
  'lane-maintenance': { icon: Wrench, className: 'text-amber-300 bg-amber-400/10' },
}

export function ActivityFeed({ entries, now }: { entries: ActivityEntry[]; now: Date }) {
  return (
    <ol className="divide-y divide-border">
      {entries.map((entry) => {
        const { icon: Icon, className } = KIND_STYLES[entry.kind]
        return (
          <li key={entry.id} className="flex items-start gap-3 px-5 py-3">
            <span className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md ${className}`}>
              <Icon aria-hidden className="size-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-body-sm">{entry.message}</p>
              <p className="text-caption text-muted">
                <time dateTime={entry.at}>{formatAgo(entry.at, now)}</time>
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
