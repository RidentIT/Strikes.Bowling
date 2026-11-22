'use client'

import { History, Search, X } from 'lucide-react'
import { useState } from 'react'
import { PlayerNames } from '../components/game/PlayerList'
import { FrontDeskGate } from '../components/shell/FrontDeskGate'
import { PageHeader } from '../components/shell/PageHeader'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { INPUT_CLASSES } from '../components/ui/field-styles'
import { Panel } from '../components/ui/Panel'
import { GameStatusBadge } from '../components/ui/StatusBadge'
import { useFrontDesk } from '../context/FrontDeskProvider'
import { useGameActions } from '../hooks/useGameActions'
import { durationBetween, formatDate, formatLaneNumber, formatTime, pluralize, toDateKey } from '../lib/format'
import { filterHistory, selectLanesById, type HistoryFilters } from '../state/front-desk-selectors'

const HEADER_CELL = 'whitespace-nowrap px-4 py-3 text-left text-eyebrow font-semibold text-muted uppercase first:pl-5 last:pr-5'
const CELL = 'whitespace-nowrap px-4 py-3.5 align-middle first:pl-5 last:pr-5'

const EMPTY_FILTERS: HistoryFilters = { query: '', date: '', status: 'all' }

const STATUS_OPTIONS: { value: HistoryFilters['status']; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const isStatusFilter = (value: string): value is HistoryFilters['status'] =>
  STATUS_OPTIONS.some((option) => option.value === value)

function GameHistory() {
  const { state, now } = useFrontDesk()
  const { viewGame, dialogs } = useGameActions()
  const [filters, setFilters] = useState<HistoryFilters>(EMPTY_FILTERS)

  const lanesById = selectLanesById(state)
  const games = filterHistory(state.gameHistory, filters)
  const filtered = filters.query !== '' || filters.date !== '' || filters.status !== 'all'
  const update = (patch: Partial<HistoryFilters>) => setFilters((current) => ({ ...current, ...patch }))

  return (
    <>
      <PageHeader
        title="Game History"
        description="Completed and cancelled sessions. Search by game number, group or player name."
      />

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="min-w-64 flex-1 sm:max-w-sm">
          <label htmlFor="history-search" className="sr-only">
            Search games
          </label>
          <div className="relative">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              id="history-search"
              type="search"
              value={filters.query}
              onChange={(event) => update({ query: event.target.value })}
              placeholder="Game number, group or player"
              autoComplete="off"
              className={`${INPUT_CLASSES} h-10 pl-9`}
            />
          </div>
        </div>
        <div>
          <label htmlFor="history-date" className="mb-1 block text-caption text-muted">
            Date
          </label>
          <input
            id="history-date"
            type="date"
            value={filters.date}
            max={toDateKey(now)}
            onChange={(event) => update({ date: event.target.value })}
            className={`${INPUT_CLASSES} h-10 w-44 [color-scheme:dark]`}
          />
        </div>
        <div>
          <label htmlFor="history-status" className="mb-1 block text-caption text-muted">
            Status
          </label>
          <select
            id="history-status"
            value={filters.status}
            onChange={(event) => {
              if (isStatusFilter(event.target.value)) update({ status: event.target.value })
            }}
            className={`${INPUT_CLASSES} h-10 w-40 [color-scheme:dark]`}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-1.5">
          <Button
            variant="ghost"
            onClick={() => update({ date: toDateKey(now) })}
            aria-pressed={filters.date === toDateKey(now)}
          >
            Today
          </Button>
          {filtered && (
            <Button variant="ghost" onClick={() => setFilters(EMPTY_FILTERS)}>
              <X aria-hidden />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      <Panel
        title={`${pluralize(games.length, 'game')}${filtered ? ' found' : ''}`}
        description={filtered ? `out of ${state.gameHistory.length} in history` : 'Most recent first'}
        flush
      >
        <p className="sr-only" aria-live="polite">
          {pluralize(games.length, 'game')} shown
        </p>
        {games.length === 0 ? (
          <EmptyState
            icon={History}
            title={filtered ? 'No games match these filters' : 'No games in history yet'}
            description={
              filtered ? 'Try another search or date.' : 'Games appear here once they are ended from Active Games.'
            }
            action={
              filtered && (
                <Button size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
                  Clear filters
                </Button>
              )
            }
          />
        ) : (
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse">
              <caption className="sr-only">Game history</caption>
              <thead className="border-b border-border bg-background-raised/50">
                <tr>
                  <th scope="col" className={HEADER_CELL}>Game</th>
                  <th scope="col" className={HEADER_CELL}>Lane</th>
                  <th scope="col" className={HEADER_CELL}>Group</th>
                  <th scope="col" className={HEADER_CELL}>Players</th>
                  <th scope="col" className={HEADER_CELL}>Start</th>
                  <th scope="col" className={HEADER_CELL}>End</th>
                  <th scope="col" className={HEADER_CELL}>Duration</th>
                  <th scope="col" className={HEADER_CELL}>Status</th>
                  <th scope="col" className={HEADER_CELL}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {games.map((game) => {
                  const lane = lanesById.get(game.laneId)
                  return (
                    <tr key={game.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className={`${CELL} text-body-sm font-semibold tabular-nums`}>{game.gameNumber}</td>
                      <td className={`${CELL} text-body-sm tabular-nums`}>
                        {lane ? `Lane ${formatLaneNumber(lane.laneNumber)}` : 'Unknown'}
                      </td>
                      <td className={`${CELL} max-w-44 truncate text-body-sm`}>
                        {game.groupName || <span className="text-muted">No group name</span>}
                      </td>
                      <td className={`${CELL} max-w-48`}>
                        <p className="text-body-sm font-medium tabular-nums">{game.players.length}</p>
                        <p className="truncate">
                          <PlayerNames players={game.players} limit={2} />
                        </p>
                      </td>
                      <td className={`${CELL} text-body-sm tabular-nums`}>
                        <p>{formatTime(game.startTime)}</p>
                        <p className="text-caption text-muted">{formatDate(game.startTime)}</p>
                      </td>
                      <td className={`${CELL} text-body-sm tabular-nums`}>
                        {game.endTime ? (
                          <>
                            <p>{formatTime(game.endTime)}</p>
                            <p className="text-caption text-muted">{formatDate(game.endTime)}</p>
                          </>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className={`${CELL} text-body-sm tabular-nums`}>
                        {game.status === 'completed' && game.endTime ? (
                          durationBetween(game.startTime, game.endTime)
                        ) : (
                          <span className="text-muted">Not played</span>
                        )}
                      </td>
                      <td className={CELL}>
                        <GameStatusBadge status={game.status} />
                      </td>
                      <td className={`${CELL} text-right`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => viewGame(game.id)}
                          aria-label={`View details of ${game.gameNumber}`}
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {dialogs}
    </>
  )
}

export function GameHistoryPage() {
  return (
    <FrontDeskGate>
      <GameHistory />
    </FrontDeskGate>
  )
}
