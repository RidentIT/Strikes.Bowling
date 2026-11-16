import { ChartLine, Monitor, MonitorPlay, Settings, Tv, Wrench } from 'lucide-react'
import { ROUTES } from '@/lib/routes'
import type { Destination, DestinationId } from '@/types/navigation'

export const DESTINATIONS: Record<DestinationId, Destination> = {
  'front-desk': {
    id: 'front-desk',
    title: 'Front Desk',
    description: 'Reservations, billing, sessions & lanes',
    path: ROUTES.frontDesk,
    icon: Monitor,
    accentClassName: 'text-primary',
  },
  'on-lane': {
    id: 'on-lane',
    title: 'On-Lane Display',
    description: 'Player information & live scoring',
    path: ROUTES.onLane,
    icon: MonitorPlay,
    accentClassName: 'text-brand-cyan',
  },
  overhead: {
    id: 'overhead',
    title: 'Overhead Display',
    description: 'Bowling scoreboard',
    path: ROUTES.overhead,
    icon: Tv,
    accentClassName: 'text-brand-purple',
  },
  admin: {
    id: 'admin',
    title: 'Admin Panel',
    description: 'Users & system configuration',
    path: ROUTES.admin,
    icon: Settings,
    accentClassName: 'text-brand-purple',
  },
  technician: {
    id: 'technician',
    title: 'Technician Panel',
    description: 'Hardware monitoring & diagnostics',
    path: ROUTES.technician,
    icon: Wrench,
    accentClassName: 'text-brand-green',
  },
  manager: {
    id: 'manager',
    title: 'Manager Dashboard',
    description: 'Business analytics & reports',
    path: ROUTES.manager,
    icon: ChartLine,
    accentClassName: 'text-brand-red',
  },
}

/** Destinations in landing-page order. */
export const DESTINATION_LIST = Object.values(DESTINATIONS)
