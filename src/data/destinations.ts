import { ChartLine, Monitor, MonitorPlay, Settings, Tv, Wrench } from 'lucide-react'
import { ROUTES } from '@/lib/routes'
import type { Destination, DestinationId } from '@/types/navigation'

export const DESTINATIONS: Record<DestinationId, Destination> = {
  'front-desk': {
    id: 'front-desk',
    title: 'Front Desk',
    description: 'Reservations, billing and lane management.',
    category: 'Guest services',
    path: ROUTES.frontDesk,
    icon: Monitor,
    accent: { from: 'brand-rose', to: 'brand-crimson' },
  },
  'on-lane': {
    id: 'on-lane',
    title: 'On-Lane Display',
    description: 'Live player scoring.',
    category: 'Lane display',
    path: ROUTES.onLane,
    icon: MonitorPlay,
    accent: { from: 'brand-cyan', to: 'brand-blue' },
  },
  overhead: {
    id: 'overhead',
    title: 'Overhead Display',
    description: 'Bowling scoreboard.',
    category: 'Lane display',
    path: ROUTES.overhead,
    icon: Tv,
    accent: { from: 'brand-purple', to: 'brand-violet' },
  },
  admin: {
    id: 'admin',
    title: 'Admin Panel',
    description: 'Users and configurations.',
    category: 'Administration',
    path: ROUTES.admin,
    icon: Settings,
    accent: { from: 'brand-indigo', to: 'brand-blue' },
  },
  technician: {
    id: 'technician',
    title: 'Technician Panel',
    description: 'Hardware monitoring and diagnostics.',
    category: 'Maintenance',
    path: ROUTES.technician,
    icon: Wrench,
    accent: { from: 'brand-emerald', to: 'brand-cyan' },
  },
  manager: {
    id: 'manager',
    title: 'Manager Dashboard',
    description: 'Analytics and reports.',
    category: 'Insights',
    path: ROUTES.manager,
    icon: ChartLine,
    accent: { from: 'brand-orange', to: 'brand-coral' },
  },
}

/** Destinations in landing-page order. */
export const DESTINATION_LIST = Object.values(DESTINATIONS)
