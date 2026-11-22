import { toDateKey } from '../lib/format'
import type { FinishedGameStatus, FrontDeskState, Game, Lane, LaneStatus } from '../types/front-desk.types'

/** Every figure on the dashboard comes from here, so all pages agree. */
export function selectStats(state: FrontDeskState) {
  return {
    activeGames: state.activeGames.length,
    playersBowling: state.activeGames.reduce((sum, game) => sum + game.players.length, 0),
    availableLanes: state.lanes.filter((lane) => lane.status === 'available').length,
    waitingSessions: state.reservations.length,
    totalLanes: state.lanes.length,
  }
}

export function selectLaneCounts(state: FrontDeskState): Record<LaneStatus, number> {
  const counts: Record<LaneStatus, number> = { available: 0, occupied: 0, reserved: 0, cleaning: 0, maintenance: 0 }
  for (const lane of state.lanes) counts[lane.status] += 1
  return counts
}

export const selectAvailableLanes = (state: FrontDeskState) =>
  state.lanes.filter((lane) => lane.status === 'available')

export function selectLanesById(state: FrontDeskState): Map<string, Lane> {
  return new Map(state.lanes.map((lane) => [lane.id, lane]))
}

/** The game a lane is holding: its active game, or its reservation. */
export function selectLaneGame(state: FrontDeskState, lane: Lane): Game | undefined {
  if (!lane.currentGameId) return undefined
  const games = lane.status === 'reserved' ? state.reservations : state.activeGames
  return games.find((game) => game.id === lane.currentGameId)
}

export function selectGame(state: FrontDeskState, gameId: string): Game | undefined {
  return [...state.activeGames, ...state.reservations, ...state.gameHistory].find((game) => game.id === gameId)
}

/** Active games, longest-running first. */
export const selectActiveGamesByStart = (state: FrontDeskState) =>
  [...state.activeGames].sort((a, b) => a.startTime.localeCompare(b.startTime))

/** Reservations, soonest first. */
export const selectUpcomingReservations = (state: FrontDeskState) =>
  [...state.reservations].sort((a, b) => a.startTime.localeCompare(b.startTime))

export interface HistoryFilters {
  query: string
  /** YYYY-MM-DD, or empty for any day. */
  date: string
  status: FinishedGameStatus | 'all'
}

/** Search by game number, group name or player name; filter by the day the game ended and its status. */
export function filterHistory(history: Game[], filters: HistoryFilters): Game[] {
  const query = filters.query.trim().toLocaleLowerCase()
  return history
    .filter((game) => filters.status === 'all' || game.status === filters.status)
    .filter((game) => !filters.date || toDateKey(game.endTime ?? game.startTime) === filters.date)
    .filter(
      (game) =>
        !query ||
        game.gameNumber.toLocaleLowerCase().includes(query) ||
        game.groupName.toLocaleLowerCase().includes(query) ||
        game.players.some((player) => player.name.toLocaleLowerCase().includes(query)),
    )
    .sort((a, b) => (b.endTime ?? b.startTime).localeCompare(a.endTime ?? a.startTime))
}
