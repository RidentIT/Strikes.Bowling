import type { LucideIcon } from 'lucide-react'
import type { AppRoute } from '@/lib/routes'
import type { Accent } from './theme'

export type DestinationId =
  | 'front-desk'
  | 'on-lane'
  | 'overhead'
  | 'admin'
  | 'technician'
  | 'manager'

export interface Destination {
  id: DestinationId
  title: string
  description: string
  /** Short area label, e.g. "Guest services". */
  category: string
  path: AppRoute
  icon: LucideIcon
  accent: Accent
}
