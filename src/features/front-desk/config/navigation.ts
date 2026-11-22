import { History, LayoutDashboard, LayoutGrid, PlayCircle, PlusCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ROUTES } from '@/lib/routes'

export interface FrontDeskNavItem {
  label: string
  href: string
  icon: LucideIcon
  /** Count shown next to the label, if any. */
  badge?: 'active-games'
}

export const FRONT_DESK_NAV: FrontDeskNavItem[] = [
  { label: 'Dashboard', href: ROUTES.frontDesk, icon: LayoutDashboard },
  { label: 'Lane Management', href: ROUTES.frontDeskLanes, icon: LayoutGrid },
  { label: 'New Game', href: ROUTES.frontDeskNewGame, icon: PlusCircle },
  { label: 'Active Games', href: ROUTES.frontDeskActiveGames, icon: PlayCircle, badge: 'active-games' },
  { label: 'Game History', href: ROUTES.frontDeskHistory, icon: History },
]

export function isNavItemActive(item: FrontDeskNavItem, pathname: string): boolean {
  return item.href === ROUTES.frontDesk ? pathname === item.href : pathname.startsWith(item.href)
}

/** The bowler-facing display for a lane. It currently runs the display's demo data. */
export const laneDisplayHref = (laneNumber: number) =>
  `${ROUTES.overhead}?lane=${String(laneNumber).padStart(2, '0')}`
