import type { LucideIcon } from 'lucide-react'
import type { AppRoute } from '@/lib/routes'
import type { AccentColor } from './theme'

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
  path: AppRoute
  icon: LucideIcon
  accent: AccentColor
}
