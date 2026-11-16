import { ChartLine, Monitor, MonitorPlay, Settings, Tv, Wrench } from 'lucide-react'
import { ROUTES } from '@/lib/routes'
import type { Destination, DestinationId } from '@/types/navigation'

export const DESTINATIONS: Record<DestinationId, Destination> = {
  'front-desk': {
    id: 'front-desk',
    title: 'Front Desk',
    description: 'Reservations, billing and lane management.',
    path: ROUTES.frontDesk,
    icon: Monitor,
    accent: 'primary',
  },
  'on-lane': {
    id: 'on-lane',
    title: 'On-Lane Display',
    description: 'Live player scoring.',
    path: ROUTES.onLane,
    icon: MonitorPlay,
    accent: 'brand-cyan',
  },
  overhead: {
    id: 'overhead',
    title: 'Overhead Display',
    description: 'Bowling scoreboard.',
    path: ROUTES.overhead,
    icon: Tv,
    accent: 'brand-purple',
  },
  admin: {
    id: 'admin',
    title: 'Admin Panel',
    description: 'Users and configurations.',
    path: ROUTES.admin,
    icon: Settings,
    accent: 'brand-yellow',
  },
  technician: {
    id: 'technician',
    title: 'Technician Panel',
    description: 'Hardware monitoring and diagnostics.',
    path: ROUTES.technician,
    icon: Wrench,
    accent: 'brand-green',
  },
  manager: {
    id: 'manager',
    title: 'Manager Dashboard',
    description: 'Analytics and reports.',
    path: ROUTES.manager,
    icon: ChartLine,
    accent: 'brand-red',
  },
}

/** Destinations in landing-page order. */
export const DESTINATION_LIST = Object.values(DESTINATIONS)
