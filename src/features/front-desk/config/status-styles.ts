import type { GameStatus, LaneStatus, SessionType } from '../types/front-desk.types'

export interface StatusStyle {
  label: string
  /** Badge colours (border, background, text). */
  badge: string
  /** Solid colour for dots and markers. */
  dot: string
}

/** One colour per lane status, used everywhere a lane status appears. */
export const LANE_STATUS_STYLES: Record<LaneStatus, StatusStyle> = {
  available: {
    label: 'Available',
    badge: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
    dot: 'bg-emerald-400',
  },
  occupied: {
    label: 'Occupied',
    badge: 'border-rose-400/30 bg-rose-500/12 text-rose-300',
    dot: 'bg-rose-500',
  },
  reserved: {
    label: 'Reserved',
    badge: 'border-indigo-400/30 bg-indigo-400/12 text-indigo-300',
    dot: 'bg-indigo-400',
  },
  cleaning: {
    label: 'Cleaning',
    badge: 'border-sky-400/25 bg-sky-400/10 text-sky-300',
    dot: 'bg-sky-400',
  },
  maintenance: {
    label: 'Maintenance',
    badge: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    dot: 'bg-amber-400',
  },
}

export const GAME_STATUS_STYLES: Record<GameStatus, StatusStyle> = {
  waiting: {
    label: 'Waiting',
    badge: 'border-indigo-400/30 bg-indigo-400/12 text-indigo-300',
    dot: 'bg-indigo-400',
  },
  'in-progress': {
    label: 'In progress',
    badge: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
    dot: 'bg-emerald-400',
  },
  completed: {
    label: 'Completed',
    badge: 'border-white/12 bg-white/5 text-secondary',
    dot: 'bg-slate-400',
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    dot: 'bg-amber-400',
  },
}

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  'walk-in': 'Walk-in',
  reservation: 'Reservation',
}
