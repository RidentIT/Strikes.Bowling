'use client'

import type { CSSProperties } from 'react'
import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { BowlingEventOverlay } from './components/BowlingEventOverlay'
import { BowlingHeader } from './components/BowlingHeader'
import { CurrentPlayerPanel } from './components/CurrentPlayerPanel'
import { FinalResults } from './components/FinalResults'
import { Scoreboard } from './components/Scoreboard'
import { DISPLAY_MODE_SETTINGS } from './config/display-modes'
import { useBowlingEvents } from './hooks/useBowlingEvents'
import type { DisplayMode, GameState } from './types/bowling-display.types'

interface BowlerDisplayProps {
  /** Presentation only: typography and spacing. Both modes show the same game state. */
  displayMode: DisplayMode
  laneId: string
  /** The authoritative game state. Both displays receive the same snapshot. */
  game: GameState
}

/**
 * Unified Bowler Display, used by both the On-Lane and Overhead routes.
 * It sizes itself to the viewport and never scrolls the page.
 */
export function BowlerDisplay({ displayMode, laneId, game }: BowlerDisplayProps) {
  const { typeScale } = DISPLAY_MODE_SETTINGS[displayMode]
  const activeEvent = useBowlingEvents(game.latestEvent)
  const activePlayer = game.players.find((player) => player.number === game.activePlayerNumber)
  const eventPlayerName = game.players.find(
    (player) => player.number === activeEvent?.playerNumber,
  )?.name

  return (
    <>
      <AmbientBackground />
      <div
        data-mode={displayMode}
        style={{ '--type-scale': typeScale } as CSSProperties}
        className="bowling-display u-p-24 u-gap-14 relative flex h-dvh w-full flex-col overflow-hidden select-none"
      >
        <BowlingHeader gameId={game.gameId} laneId={laneId} />

        {game.status === 'completed' ? (
          <FinalResults players={game.players} />
        ) : (
          <>
            <CurrentPlayerPanel game={game} activePlayer={activePlayer} />
            <Scoreboard game={game} displayMode={displayMode} />
          </>
        )}

        <BowlingEventOverlay event={activeEvent} playerName={eventPlayerName} />
      </div>
    </>
  )
}
