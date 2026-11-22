'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FRONT_DESK_NAV, isNavItemActive } from '../../config/navigation'
import { useOptionalFrontDesk } from '../../context/FrontDeskProvider'

interface FrontDeskNavProps {
  orientation: 'vertical' | 'horizontal'
}

/** Front Desk navigation: a vertical list in the sidebar, a scrolling row on small screens. */
export function FrontDeskNav({ orientation }: FrontDeskNavProps) {
  const pathname = usePathname()
  const frontDesk = useOptionalFrontDesk()
  const vertical = orientation === 'vertical'

  return (
    <nav aria-label="Front Desk">
      <ul className={vertical ? 'flex flex-col gap-0.5' : 'flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none]'}>
        {FRONT_DESK_NAV.map((item) => {
          const active = isNavItemActive(item, pathname)
          const count = item.badge === 'active-games' ? frontDesk?.state.activeGames.length : undefined
          const Icon = item.icon
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`group relative flex items-center gap-3 rounded-lg text-body-sm font-medium transition-colors ${
                  vertical ? 'px-3 py-2.5' : 'px-3 py-2'
                } ${
                  active
                    ? 'bg-white/[0.06] text-foreground'
                    : 'text-secondary hover:bg-white/[0.035] hover:text-foreground'
                }`}
              >
                {active && (
                  <span
                    aria-hidden
                    className={
                      vertical
                        ? 'absolute inset-y-2 left-0 w-0.5 rounded-full bg-brand-rose'
                        : 'absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand-rose'
                    }
                  />
                )}
                <Icon
                  aria-hidden
                  className={`size-4.5 shrink-0 ${active ? 'text-brand-rose' : 'text-muted group-hover:text-secondary'}`}
                />
                <span className="whitespace-nowrap">{item.label}</span>
                {count !== undefined && count > 0 && (
                  <span
                    className={`ml-auto rounded-md px-1.5 text-caption font-semibold tabular-nums ${
                      active ? 'bg-brand-rose/15 text-rose-300' : 'bg-white/6 text-secondary'
                    }`}
                  >
                    <span className="sr-only">(</span>
                    {count}
                    <span className="sr-only"> active)</span>
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
