'use client'

import { ExternalLink, MonitorPlay } from 'lucide-react'
import type { ReactNode } from 'react'
import { laneDisplayHref } from '../../config/navigation'
import { SESSION_TYPE_LABELS } from '../../config/status-styles'
import { useFrontDesk } from '../../context/FrontDeskProvider'
import { durationBetween, formatDate, formatLaneNumber, formatTime, formatUntil } from '../../lib/format'
import type { Game } from '../../types/front-desk.types'
import { Button, LinkButton } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { GameStatusBadge } from '../ui/StatusBadge'
import { PlayerRoster } from './PlayerList'

interface GameDetailsDialogProps {
  game: Game
  onClose: () => void
  onEndGame: () => void
  onCheckIn: () => void
  onCancelReservation: () => void
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-caption text-muted">{label}</dt>
      <dd className="mt-0.5 text-body-sm font-medium">{children}</dd>
    </div>
  )
}

/** Everything about one game, with the actions that fit its status. */
export function GameDetailsDialog({ game, onClose, onEndGame, onCheckIn, onCancelReservation }: GameDetailsDialogProps) {
  const { state, now } = useFrontDesk()
  const lane = state.lanes.find((candidate) => candidate.id === game.laneId)
  const laneLabel = lane ? `Lane ${formatLaneNumber(lane.laneNumber)}` : 'Unknown lane'
  const finished = game.status === 'completed' || game.status === 'cancelled'

  const footer =
    game.status === 'in-progress' ? (
      <>
        <Button onClick={onClose}>Close</Button>
        <Button variant="danger" onClick={onEndGame}>
          End game
        </Button>
      </>
    ) : game.status === 'waiting' ? (
      <>
        <Button variant="danger" onClick={onCancelReservation}>
          Cancel reservation
        </Button>
        <Button variant="primary" onClick={onCheckIn}>
          Check in now
        </Button>
      </>
    ) : (
      <Button onClick={onClose} data-autofocus>
        Close
      </Button>
    )

  return (
    <Dialog
      size="lg"
      title={`Game ${game.gameNumber}`}
      description={
        <span className="flex flex-wrap items-center gap-2">
          <GameStatusBadge status={game.status} />
          <span>
            {laneLabel} · {SESSION_TYPE_LABELS[game.sessionType]}
          </span>
        </span>
      }
      onClose={onClose}
      footer={footer}
    >
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-border bg-background-raised p-4 sm:grid-cols-3">
        <Detail label="Group">{game.groupName || <span className="text-muted">No group name</span>}</Detail>
        <Detail label="Lane">{laneLabel}</Detail>
        <Detail label="Players">{game.players.length}</Detail>
        <Detail label={game.status === 'waiting' ? 'Booked for' : 'Started'}>
          {formatDate(game.startTime)}, {formatTime(game.startTime)}
        </Detail>
        {game.status === 'waiting' && <Detail label="Starts">{formatUntil(game.startTime, now)}</Detail>}
        {game.status === 'in-progress' && (
          <Detail label="Elapsed">
            <span className="tabular-nums">{durationBetween(game.startTime, now)}</span>
          </Detail>
        )}
        {finished && game.endTime && (
          <>
            <Detail label={game.status === 'cancelled' ? 'Cancelled' : 'Ended'}>
              {formatDate(game.endTime)}, {formatTime(game.endTime)}
            </Detail>
            <Detail label="Duration">
              {game.status === 'completed' ? durationBetween(game.startTime, game.endTime) : 'Not played'}
            </Detail>
          </>
        )}
      </dl>

      <h3 className="mt-5 mb-2.5 text-body-sm font-semibold">Players · bowling order</h3>
      <PlayerRoster players={game.players} />

      {game.status === 'in-progress' && lane && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3">
          <div className="flex items-start gap-3">
            <MonitorPlay aria-hidden className="mt-0.5 size-4.5 shrink-0 text-muted" />
            <div>
              <p className="text-body-sm font-medium">Lane scoreboard</p>
              <p className="text-caption text-muted">
                The overhead display isn&apos;t linked to front-desk games yet, so it shows its demo scoring data.
              </p>
            </div>
          </div>
          <LinkButton href={laneDisplayHref(lane.laneNumber)} target="_blank" rel="noopener" size="sm">
            Open display
            <ExternalLink aria-hidden />
          </LinkButton>
        </div>
      )}
      {finished && (
        <p className="mt-5 text-caption text-muted">
          Final scoreboards aren&apos;t available in this prototype: no scoring backend is connected.
        </p>
      )}
    </Dialog>
  )
}
