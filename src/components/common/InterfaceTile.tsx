import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { accentStyle } from '@/lib/accent'
import type { Destination } from '@/types/navigation'

interface InterfaceTileProps {
  destination: Destination
  /** 1-based position shown as "01", "02", … */
  number: number
}

export function InterfaceTile({ destination, number }: InterfaceTileProps) {
  const { title, description, category, path, accent } = destination

  return (
    <article
      style={accentStyle(accent)}
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-border-neutral bg-linear-to-b from-surface-neutral-raised to-surface-neutral p-6 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.05)] transition duration-300 ease-out hover:-translate-y-0.5 hover:border-(--accent)/35 hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.07),0_28px_48px_-28px_rgb(0_0_0/0.9)] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand-coral sm:p-7"
    >
      {/* Soft wash of the card's accent from the top-left corner. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(110%_80%_at_0%_0%,color-mix(in_oklab,var(--accent)_12%,transparent),transparent_70%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100"
      />
      {/* Gradient edge that draws across on hover. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-35 bg-linear-to-r from-(--accent) to-(--accent-to) opacity-70 transition duration-500 ease-out group-hover:scale-x-100 group-hover:opacity-100"
      />

      <div className="flex items-baseline justify-between gap-4">
        <p className="text-eyebrow text-(--accent) uppercase">{category}</p>
        <span className="text-caption font-medium tracking-[0.2em] text-muted tabular-nums">
          {String(number).padStart(2, '0')}
        </span>
      </div>

      <h3 className="mt-4 text-h2">
        {/* The ::after overlay makes the whole card clickable via this one link. */}
        <Link href={path} className="outline-none after:absolute after:inset-0 after:z-10">
          {title}
        </Link>
      </h3>
      <p className="mt-1.5 text-body-sm text-secondary">{description}</p>

      <div aria-hidden className="mt-auto pt-8">
        <div className="flex items-center justify-between border-t border-white/6 pt-5">
          <span className="text-body-sm font-semibold text-secondary transition-colors duration-300 group-hover:text-foreground">
            Launch interface
          </span>
          <span className="relative grid size-10 place-items-center overflow-hidden rounded-full border border-border-neutral text-secondary transition-colors duration-300 group-hover:border-transparent group-hover:text-white">
            <span className="absolute inset-0 bg-linear-to-br from-(--accent) to-(--accent-to) opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <ArrowRight className="relative size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  )
}
