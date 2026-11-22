import { CalendarCheck, CircleCheck, Eye, Plus, Sparkles, Wrench, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { ROUTES } from '@/lib/routes'
import { LANE_STATUS_STYLES } from '../../config/status-styles'
import { durationBetween, formatLaneNumber, formatTime, formatUntil } from '../../lib/format'
import type { Game, Lane, ManualLaneStatus } from '../../types/front-desk.types'
import { Button, LinkButton } from '../ui/Button'
import { LaneStatusBadge } from '../ui/StatusBadge'

export interface LaneCardHandlers {
  onViewGame: (gameId: string) => void
  onCheckIn: (gameId: string) => void
  onCancelReservation: (gameId: string) => void
  onSetStatus: (lane: Lane, status: ManualLaneStatus) => void
  /** Opens the maintenance dialog (asks for a reason). */
  onRequestMaintenance: (lane: Lane) => void
}

interface LaneCardProps extends LaneCardHandlers {
  lane: Lane
  /** The lane's active game or reservation. */
  game: Game | undefined
  now: Date
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-caption text-muted">{label}</dt>
      <dd className="truncate text-body-sm font-medium tabular-nums">{children}</dd>
    </div>
  )
}

const STATUS_MESSAGES = {
  available: 'Ready for the next game.',
  cleaning: 'Being cleaned and reset.',
} as const

/** One lane: its status, what's on it, and only the actions that make sense now. */
export function LaneCard({
  lane,
  game,
  now,
  onViewGame,
  onCheckIn,
  onCancelReservation,
  onSetStatus,
  onRequestMaintenance,
}: LaneCardProps) {
  const label = `Lane ${formatLaneNumber(lane.laneNumber)}`
  const style = LANE_STATUS_STYLES[lane.status]

  let body: ReactNode
  let actions: ReactNode

  switch (lane.status) {
    case 'occupied':
      body = game ? (
        <dl className="space-y-1.5">
          <Fact label="Game">{game.gameNumber}</Fact>
          <Fact label="Group">{game.groupName || <span className="text-muted">No name</span>}</Fact>
          <Fact label="Players">{game.players.length}</Fact>
          <Fact label="Started">{formatTime(game.startTime)}</Fact>
          <Fact label="Elapsed">{durationBetween(game.startTime, now)}</Fact>
        </dl>
      ) : (
        <p className="text-caption text-muted">Game details unavailable.</p>
      )
      actions = game && (
        <Button size="sm" variant="secondary" onClick={() => onViewGame(game.id)} className="flex-1">
          <Eye aria-hidden />
          View game
        </Button>
      )
      break

    case 'reserved':
      body = game ? (
        <dl className="space-y-1.5">
          <Fact label="Booking">{game.gameNumber}</Fact>
          <Fact label="Group">{game.groupName || <span className="text-muted">No name</span>}</Fact>
          <Fact label="Players">{game.players.length}</Fact>
          <Fact label="Booked for">
            {formatTime(game.startTime)} <span className="text-muted">({formatUntil(game.startTime, now)})</span>
          </Fact>
        </dl>
      ) : (
        <p className="text-caption text-muted">Reservation details unavailable.</p>
      )
      actions = game && (
        <>
          <Button size="sm" variant="primary" onClick={() => onCheckIn(game.id)} className="flex-1">
            <CalendarCheck aria-hidden />
            Check in
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onViewGame(game.id)} aria-label={`View reservation on ${label}`}>
            <Eye aria-hidden />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onCancelReservation(game.id)}
            aria-label={`Cancel reservation on ${label}`}
            title="Cancel reservation"
          >
            <X aria-hidden />
          </Button>
        </>
      )
      break

    case 'available':
      body = <p className="text-body-sm text-secondary">{STATUS_MESSAGES.available}</p>
      actions = (
        <>
          <LinkButton
            size="sm"
            variant="primary"
            href={`${ROUTES.frontDeskNewGame}?lane=${lane.id}`}
            className="flex-1"
            aria-label={`Assign a game to ${label}`}
          >
            <Plus aria-hidden />
            Assign game
          </LinkButton>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSetStatus(lane, 'cleaning')}
            aria-label={`Mark ${label} for cleaning`}
            title="Mark for cleaning"
          >
            <Sparkles aria-hidden />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRequestMaintenance(lane)}
            aria-label={`Mark ${label} under maintenance`}
            title="Mark under maintenance"
          >
            <Wrench aria-hidden />
          </Button>
        </>
      )
      break

    case 'cleaning':
      body = <p className="text-body-sm text-secondary">{STATUS_MESSAGES.cleaning}</p>
      actions = (
        <>
          <Button size="sm" variant="secondary" onClick={() => onSetStatus(lane, 'available')} className="flex-1">
            <CircleCheck aria-hidden />
            Mark available
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRequestMaintenance(lane)}
            aria-label={`Mark ${label} under maintenance`}
            title="Mark under maintenance"
          >
            <Wrench aria-hidden />
          </Button>
        </>
      )
      break

    case 'maintenance':
      body = <p className="text-body-sm text-secondary">{lane.notes || 'Out of service.'}</p>
      actions = (
        <Button size="sm" variant="secondary" onClick={() => onSetStatus(lane, 'available')} className="flex-1">
          <CircleCheck aria-hidden />
          Return to service
        </Button>
      )
      break
  }

  return (
    <article
      id={lane.id}
      aria-label={`${label}, ${style.label}`}
      className="relative flex scroll-mt-28 flex-col overflow-hidden rounded-xl border border-border bg-surface target:border-brand-rose/50"
    >
      <span aria-hidden className={`absolute inset-x-0 top-0 h-0.5 ${style.dot}`} />
      <header className="flex items-center justify-between gap-3 px-4 pt-4">
        <h2 className="text-h3 tabular-nums">{label}</h2>
        <LaneStatusBadge status={lane.status} />
      </header>
      <div className="flex-1 px-4 py-3.5">{body}</div>
      <footer className="flex items-center gap-1.5 border-t border-border px-3 py-2.5">{actions}</footer>
    </article>
  )
}
