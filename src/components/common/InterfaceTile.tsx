import { ArrowRight } from 'lucide-react'
import * as motion from 'motion/react-client'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { accentStyle } from '@/lib/accent'
import type { Destination } from '@/types/navigation'

interface InterfaceTileProps {
  destination: Destination
  /** 1-based position shown as "01", "02", … */
  number: number
}

export function InterfaceTile({ destination, number }: InterfaceTileProps) {
  const { title, description, path, icon: Icon, accent } = destination

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={accentStyle(accent)}
      className="group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-lg shadow-black/20 transition-[border-color,box-shadow] duration-300 hover:border-(--accent)/40 hover:shadow-xl hover:shadow-(--accent)/10"
    >
      <div className="flex items-start justify-between">
        <span className="grid size-12 place-items-center rounded-xl bg-(--accent)/10 text-(--accent) ring-1 ring-(--accent)/20">
          <Icon className="size-6" aria-hidden />
        </span>
        <span className="text-caption font-semibold tabular-nums text-muted">
          {String(number).padStart(2, '0')}
        </span>
      </div>

      <h3 className="mt-5">{title}</h3>
      <p className="mt-1 text-body-sm text-muted">{description}</p>

      {/* The ::after overlay makes the whole tile clickable via this one link. */}
      <ButtonLink
        href={path}
        aria-label={`Launch ${title}`}
        className="mt-6 w-full after:absolute after:inset-0 after:rounded-2xl"
      >
        Launch Interface
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </ButtonLink>
    </motion.article>
  )
}
