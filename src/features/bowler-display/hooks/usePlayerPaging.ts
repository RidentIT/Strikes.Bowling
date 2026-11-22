import { useMemo } from 'react'
import type { Player } from '../types/bowling-display.types'

export interface PlayerPage {
  /** Zero-based index of the visible group. */
  pageIndex: number
  pageCount: number
  visiblePlayers: Player[]
  /** First and last player number in the visible group. */
  firstNumber: number
  lastNumber: number
}

interface UsePlayerPagingOptions {
  players: Player[]
  /** The player whose turn it is; null when no one is bowling. */
  activePlayerNumber: number | null
  /** How many player rows fit on screen. */
  capacity: number
}

/**
 * Chooses which group of players to show, driven only by the game's active
 * player. Players are split into fixed groups of `capacity` in bowling order
 * (e.g. 1–5, 6–10, 11–14), so the group changes only when the active player
 * moves into another group. There is no manual control.
 */
export function usePlayerPaging({
  players,
  activePlayerNumber,
  capacity,
}: UsePlayerPagingOptions): PlayerPage {
  return useMemo(() => {
    const size = Math.max(1, capacity)
    const pageCount = Math.max(1, Math.ceil(players.length / size))

    const activeIndex = players.findIndex((player) => player.number === activePlayerNumber)
    const pageIndex = activeIndex < 0 ? 0 : Math.floor(activeIndex / size)

    const visiblePlayers = players.slice(pageIndex * size, pageIndex * size + size)
    return {
      pageIndex,
      pageCount,
      visiblePlayers,
      firstNumber: visiblePlayers[0]?.number ?? 0,
      lastNumber: visiblePlayers.at(-1)?.number ?? 0,
    }
  }, [players, activePlayerNumber, capacity])
}
