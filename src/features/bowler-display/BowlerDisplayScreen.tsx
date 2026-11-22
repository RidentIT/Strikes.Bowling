'use client'

import { BowlerDisplay } from './BowlerDisplay'
import { useDemoGameState } from './hooks/useDemoGameState'
import type { DisplayMode } from './types/bowling-display.types'

interface BowlerDisplayScreenProps {
  displayMode: DisplayMode
  laneId: string
  /** Demo only: number of players in the demonstration game. */
  scenario: number
  /** Demo only: hold the demonstration at a fixed step. */
  step?: number
}

/**
 * Connects a display to its game state. Both routes use this same component,
 * so both always read the same state source. Swap `useDemoGameState` for the
 * live feed here when the backend is connected.
 */
export function BowlerDisplayScreen({ displayMode, laneId, scenario, step }: BowlerDisplayScreenProps) {
  const game = useDemoGameState({ scenario, step })

  if (!game) return <div className="h-dvh bg-background" />
  return <BowlerDisplay displayMode={displayMode} laneId={laneId} game={game} />
}
