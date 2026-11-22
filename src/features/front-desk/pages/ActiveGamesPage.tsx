'use client'

import { ExternalLink, PlayCircle, Plus, Square, Users } from 'lucide-react'
import { ROUTES } from '@/lib/routes'
import { PlayerNames } from '../components/game/PlayerList'
import { FrontDeskGate } from '../components/shell/FrontDeskGate'
import { PageHeader } from '../components/shell/PageHeader'
import { Button, LinkButton } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Panel } from '../components/ui/Panel'
import { GameStatusBadge } from '../components/ui/StatusBadge'
import { laneDisplayHref } from '../config/navigation'
import { SESSION_TYPE_LABELS } from '../config/status-styles'
import { useFrontDesk } from '../context/FrontDeskProvider'
import { useGameActions } from '../hooks/useGameActions'
import { durationBetween, formatLaneNumber, formatTime, pluralize } from '../lib/format'
import { selectActiveGamesByStart, selectLanesById, selectStats } from '../state/front-desk-selectors'

const HEADER_CELL = 'whitespace-nowrap px-4 py-3 text-left text-eyebrow font-semibold text-muted uppercase first:pl-5 last:pr-5'
const CELL = 'whitespace-nowrap px-4 py-3.5 align-middle first:pl-5 last:pr-5'

function ActiveGames() {
  const { state, now } = useFrontDesk()
  const { viewGame, requestEndGame, dialogs } = useGameActions()
  const games = selectActiveGamesByStart(state)
  const lanesById = selectLanesById(state)
  const stats = selectStats(state)

  return (
    <>
      <PageHeader
        title="Active Games"
        description="Games being bowled right now. End a game when the group finishes to free its lane."
        actions={
          <LinkButton href={ROUTES.frontDeskNewGame} variant="primary">
            <Plus aria-hidden />
            New game
          </LinkButton>
        }
      />

      <Panel
        title={`${pluralize(stats.activeGames, 'game')} in progress`}
        description={`${pluralize(stats.playersBowling, 'player')} bowling · longest running first`}
        flush
      >
        {games.length === 0 ? (
          <EmptyState
            icon={PlayCircle}
            title="No games in progress"
            description="When staff start a game it appears here with its lane, players and running time."
            action={
              <LinkButton href={ROUTES.frontDeskNewGame} variant="primary" size="sm">
                <Plus aria-hidden />
                New game
              </LinkButton>
            }
          />
        ) : (
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse">
              <caption className="sr-only">Active games</caption>
              <thead className="border-b border-border bg-background-raised/50">
                <tr>
                  <th scope="col" className={HEADER_CELL}>Lane · Game</th>
                  <th scope="col" className={HEADER_CELL}>Group</th>
                  <th scope="col" className={HEADER_CELL}>Players</th>
                  <th scope="col" className={HEADER_CELL}>Started</th>
                  <th scope="col" className={HEADER_CELL}>Elapsed</th>
                  <th scope="col" className={HEADER_CELL}>Status</th>
                  <th scope="col" className={`${HEADER_CELL} text-right`}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {games.map((game) => {
                  const lane = lanesById.get(game.laneId)
                  const laneLabel = lane ? `Lane ${formatLaneNumber(lane.laneNumber)}` : 'Unknown'
                  return (
                    <tr key={game.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className={CELL}>
                        <p className="text-body-sm font-semibold tabular-nums">{laneLabel}</p>
                        <button
                          type="button"
                          onClick={() => viewGame(game.id)}
                          className="text-caption text-secondary tabular-nums underline decoration-white/15 underline-offset-4 hover:text-foreground hover:decoration-white/50"
                        >
                          {game.gameNumber}
                        </button>
                      </td>
                      <td className={`${CELL} max-w-52`}>
                        <p className="truncate text-body-sm">
                          {game.groupName || <span className="text-muted">No group name</span>}
                        </p>
                        <p className="text-caption text-muted">{SESSION_TYPE_LABELS[game.sessionType]}</p>
                      </td>
                      <td className={`${CELL} max-w-56`}>
                        <button
                          type="button"
                          onClick={() => viewGame(game.id)}
                          className="inline-flex items-center gap-1.5 text-body-sm font-medium hover:text-brand-coral"
                          aria-label={`View ${pluralize(game.players.length, 'player')} in ${game.gameNumber}`}
                        >
                          <Users aria-hidden className="size-3.5 text-muted" />
                          {game.players.length}
                        </button>
                        <p className="truncate">
                          <PlayerNames players={game.players} />
                        </p>
                      </td>
                      <td className={`${CELL} text-body-sm tabular-nums`}>{formatTime(game.startTime)}</td>
                      <td className={`${CELL} text-body-sm font-semibold tabular-nums`}>
                        {durationBetween(game.startTime, now)}
                      </td>
                      <td className={CELL}>
                        <GameStatusBadge status={game.status} />
                      </td>
                      <td className={CELL}>
                        <div className="flex items-center justify-end gap-1.5">
                          <Button size="sm" variant="ghost" onClick={() => viewGame(game.id)}>
                            Details
                          </Button>
                          {lane && (
                            <LinkButton
                              size="sm"
                              variant="ghost"
                              href={laneDisplayHref(lane.laneNumber)}
                              target="_blank"
                              rel="noopener"
                              aria-label={`Open the ${laneLabel} scoreboard display in a new tab (demo scoring data)`}
                              title="Lane scoreboard display (demo scoring data)"
                            >
                              <ExternalLink aria-hidden />
                            </LinkButton>
                          )}
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => requestEndGame(game.id)}
                            aria-label={`End game ${game.gameNumber}`}
                          >
                            <Square aria-hidden />
                            End game
                          </Button>
                        </div>
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

export function ActiveGamesPage() {
  return (
    <FrontDeskGate>
      <ActiveGames />
    </FrontDeskGate>
  )
}
