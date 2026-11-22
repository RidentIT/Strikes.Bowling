'use client'

import { ArrowRight, CalendarClock, Clock3, LayoutGrid, PlayCircle, Plus, Users } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/lib/routes'
import { ActivityFeed } from '../components/dashboard/ActivityFeed'
import { StatCard } from '../components/dashboard/StatCard'
import { PlayerNames } from '../components/game/PlayerList'
import { FrontDeskGate } from '../components/shell/FrontDeskGate'
import { PageHeader } from '../components/shell/PageHeader'
import { LinkButton } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Panel } from '../components/ui/Panel'
import { LANE_STATUS_STYLES } from '../config/status-styles'
import { useFrontDesk } from '../context/FrontDeskProvider'
import { useGameActions } from '../hooks/useGameActions'
import { durationBetween, formatLaneNumber, formatLongDate, formatTime, formatUntil, pluralize } from '../lib/format'
import {
  selectActiveGamesByStart,
  selectLaneCounts,
  selectLanesById,
  selectStats,
  selectUpcomingReservations,
} from '../state/front-desk-selectors'
import { LANE_STATUSES } from '../types/front-desk.types'

const VIEW_ALL_CLASSES =
  'inline-flex shrink-0 items-center gap-1 text-caption font-semibold text-secondary transition-colors hover:text-foreground'

function Dashboard() {
  const { state, now } = useFrontDesk()
  const { viewGame, dialogs } = useGameActions()

  const stats = selectStats(state)
  const laneCounts = selectLaneCounts(state)
  const lanesById = selectLanesById(state)
  const activeGames = selectActiveGamesByStart(state)
  const reservations = selectUpcomingReservations(state)
  const laneLabel = (laneId: string) => {
    const lane = lanesById.get(laneId)
    return lane ? `Lane ${formatLaneNumber(lane.laneNumber)}` : 'Unknown lane'
  }

  return (
    <>
      <PageHeader
        eyebrow={formatLongDate(now)}
        title="Dashboard"
        description="Today's lanes, games and bookings at a glance."
        actions={
          <>
            <LinkButton href={ROUTES.frontDeskLanes}>
              <LayoutGrid aria-hidden />
              Lane management
            </LinkButton>
            <LinkButton href={ROUTES.frontDeskNewGame} variant="primary">
              <Plus aria-hidden />
              New game
            </LinkButton>
          </>
        }
      />

      <section aria-label="Summary" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Active games"
          value={stats.activeGames}
          hint={`on ${pluralize(stats.activeGames, 'lane')}`}
          icon={PlayCircle}
          href={ROUTES.frontDeskActiveGames}
          tone="bg-rose-500/12 text-rose-300"
        />
        <StatCard
          label="Players bowling"
          value={stats.playersBowling}
          hint="across all active games"
          icon={Users}
          href={ROUTES.frontDeskActiveGames}
          tone="bg-sky-400/10 text-sky-300"
        />
        <StatCard
          label="Available lanes"
          value={stats.availableLanes}
          hint={`of ${pluralize(stats.totalLanes, 'lane')}`}
          icon={LayoutGrid}
          href={ROUTES.frontDeskLanes}
          tone="bg-emerald-400/10 text-emerald-300"
        />
        <StatCard
          label="Waiting sessions"
          value={stats.waitingSessions}
          hint="reservations not checked in"
          icon={CalendarClock}
          href={ROUTES.frontDeskLanes}
          tone="bg-indigo-400/12 text-indigo-300"
        />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel
          title="Lane status"
          description={`${pluralize(stats.totalLanes, 'lane')} in the centre`}
          action={
            <Link href={ROUTES.frontDeskLanes} className={VIEW_ALL_CLASSES}>
              Manage lanes <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          }
          className="xl:col-span-2"
        >
          <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Lanes by status">
            {LANE_STATUSES.map((status) => (
              <li key={status} className="flex items-center gap-2 text-caption text-secondary">
                <span aria-hidden className={`size-2 rounded-full ${LANE_STATUS_STYLES[status].dot}`} />
                {LANE_STATUS_STYLES[status].label}
                <span className="font-semibold text-foreground tabular-nums">{laneCounts[status]}</span>
              </li>
            ))}
          </ul>
          <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {state.lanes.map((lane) => {
              const style = LANE_STATUS_STYLES[lane.status]
              return (
                <li key={lane.id}>
                  <Link
                    href={`${ROUTES.frontDeskLanes}#${lane.id}`}
                    aria-label={`Lane ${lane.laneNumber}: ${style.label}`}
                    className="flex flex-col gap-2 rounded-lg border border-border bg-background-raised px-2.5 py-2.5 transition-colors hover:border-white/15"
                  >
                    <span className="flex items-center justify-between">
                      <span className="text-body-sm font-semibold tabular-nums">{formatLaneNumber(lane.laneNumber)}</span>
                      <span aria-hidden className={`size-2 rounded-full ${style.dot}`} />
                    </span>
                    <span className="truncate text-caption text-muted">{style.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </Panel>

        <Panel title="Upcoming reservations" description="Waiting to check in" flush>
          {reservations.length === 0 ? (
            <EmptyState compact icon={CalendarClock} title="No reservations waiting" />
          ) : (
            <ul className="divide-y divide-border">
              {reservations.map((game) => (
                <li key={game.id}>
                  <button
                    type="button"
                    onClick={() => viewGame(game.id)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left transition-colors hover:bg-white/[0.025]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-body-sm font-medium">{game.groupName || game.gameNumber}</span>
                      <span className="block text-caption text-muted">
                        {laneLabel(game.laneId)} · {pluralize(game.players.length, 'player')}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-body-sm font-semibold tabular-nums">{formatTime(game.startTime)}</span>
                      <span className="block text-caption text-indigo-300">{formatUntil(game.startTime, now)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Active games"
          description="Longest running first"
          action={
            <Link href={ROUTES.frontDeskActiveGames} className={VIEW_ALL_CLASSES}>
              View all <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          }
          className="xl:col-span-2"
          flush
        >
          {activeGames.length === 0 ? (
            <EmptyState
              compact
              icon={PlayCircle}
              title="No games in progress"
              description="Start a game to see it here."
              action={
                <LinkButton href={ROUTES.frontDeskNewGame} size="sm" variant="primary">
                  <Plus aria-hidden />
                  New game
                </LinkButton>
              }
            />
          ) : (
            <ul className="divide-y divide-border">
              {activeGames.slice(0, 6).map((game) => (
                <li key={game.id}>
                  <button
                    type="button"
                    onClick={() => viewGame(game.id)}
                    className="grid w-full grid-cols-[4.5rem_1fr_auto] items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-white/[0.025]"
                  >
                    <span className="text-body-sm font-semibold tabular-nums">{laneLabel(game.laneId)}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-body-sm font-medium">
                        {game.groupName || <span className="text-secondary">{game.gameNumber}</span>}
                        {game.groupName && <span className="ml-2 text-caption text-muted">{game.gameNumber}</span>}
                      </span>
                      <span className="block truncate">
                        <PlayerNames players={game.players} />
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 text-body-sm text-secondary tabular-nums">
                      <Clock3 aria-hidden className="size-3.5 text-muted" />
                      {durationBetween(game.startTime, now)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent activity" flush>
          <ActivityFeed entries={state.activity.slice(0, 7)} now={now} />
        </Panel>
      </div>

      {dialogs}
    </>
  )
}

export function DashboardPage() {
  return (
    <FrontDeskGate>
      <Dashboard />
    </FrontDeskGate>
  )
}
