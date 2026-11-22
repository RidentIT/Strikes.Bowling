import {
  FRONT_DESK_SCHEMA_VERSION,
  GAME_STATUSES,
  LANE_STATUSES,
  SESSION_TYPES,
  type FrontDeskState,
  type Game,
  type Lane,
} from '../types/front-desk.types'

/**
 * PROTOTYPE PERSISTENCE ONLY. Keeps the mock Front Desk state in this browser's
 * localStorage so it survives navigation and refreshes. Nothing is sent to a
 * server, and production data is never read or written here.
 */
export const FRONT_DESK_STORAGE_KEY = 'strikes.front-desk-prototype.v1'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isString = (value: unknown): value is string => typeof value === 'string'

const isOneOf = <T extends string>(options: readonly T[], value: unknown): value is T =>
  options.some((option) => option === value)

function isLane(value: unknown): value is Lane {
  return (
    isRecord(value) &&
    isString(value.id) &&
    typeof value.laneNumber === 'number' &&
    isOneOf(LANE_STATUSES, value.status) &&
    (value.currentGameId === null || isString(value.currentGameId)) &&
    isString(value.notes)
  )
}

function isGame(value: unknown): value is Game {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.gameNumber) &&
    isOneOf(SESSION_TYPES, value.sessionType) &&
    isString(value.groupName) &&
    isString(value.laneId) &&
    Array.isArray(value.players) &&
    value.players.every((player) => isRecord(player) && isString(player.id) && isString(player.name)) &&
    isString(value.startTime) &&
    (value.endTime === null || isString(value.endTime)) &&
    isOneOf(GAME_STATUSES, value.status)
  )
}

/** Runtime check for stored data, which may be stale or edited by hand. */
export function isFrontDeskState(value: unknown): value is FrontDeskState {
  return (
    isRecord(value) &&
    value.schemaVersion === FRONT_DESK_SCHEMA_VERSION &&
    Array.isArray(value.lanes) &&
    value.lanes.every(isLane) &&
    [value.reservations, value.activeGames, value.gameHistory].every(
      (games) => Array.isArray(games) && games.every(isGame),
    ) &&
    Array.isArray(value.activity) &&
    value.activity.every((entry) => isRecord(entry) && isString(entry.id) && isString(entry.message) && isString(entry.at)) &&
    typeof value.nextGameSequence === 'number' &&
    typeof value.nextActivitySequence === 'number'
  )
}

export function parseStoredState(raw: string | null): FrontDeskState | null {
  if (!raw) return null
  try {
    const value: unknown = JSON.parse(raw)
    return isFrontDeskState(value) ? value : null
  } catch {
    return null
  }
}

export function loadFrontDeskState(): FrontDeskState | null {
  try {
    return parseStoredState(window.localStorage.getItem(FRONT_DESK_STORAGE_KEY))
  } catch {
    return null
  }
}

export function saveFrontDeskState(state: FrontDeskState): void {
  try {
    window.localStorage.setItem(FRONT_DESK_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or blocked (private mode): the prototype keeps working in memory.
  }
}
