import type { Lane, NewGameInput } from '../types/front-desk.types'

export const MIN_PLAYERS = 1
export const MAX_PLAYERS = 14
export const MAX_PLAYER_NAME_LENGTH = 20
export const MAX_GROUP_NAME_LENGTH = 40
/** A game can be logged as having started up to this long ago… */
export const MAX_START_MINUTES_AGO = 120
/** …or starting at most this far ahead. */
export const MAX_START_MINUTES_AHEAD = 30

export interface NewGameErrors {
  groupName?: string
  playerCount?: string
  /** One entry per player field. */
  players: (string | undefined)[]
  lane?: string
  startTime?: string
}

/**
 * Validation for registering a game. The form uses it to show messages, and
 * the state transition uses it again so an invalid game can never be stored.
 */
export function validateNewGame(input: NewGameInput, lanes: Lane[], now: Date): NewGameErrors {
  const errors: NewGameErrors = { players: [] }

  if (input.groupName.trim().length > MAX_GROUP_NAME_LENGTH) {
    errors.groupName = `Keep the group name to ${MAX_GROUP_NAME_LENGTH} characters or fewer.`
  }

  const count = input.playerNames.length
  if (count < MIN_PLAYERS || count > MAX_PLAYERS) {
    errors.playerCount = `A game needs between ${MIN_PLAYERS} and ${MAX_PLAYERS} players.`
  }

  const seen = new Map<string, number>()
  errors.players = input.playerNames.map((rawName, index) => {
    const name = rawName.trim()
    if (!name) return `Enter a name for player ${index + 1}.`
    if (name.length > MAX_PLAYER_NAME_LENGTH) {
      return `Player ${index + 1}'s name must be ${MAX_PLAYER_NAME_LENGTH} characters or fewer.`
    }
    const key = name.toLocaleLowerCase()
    const firstIndex = seen.get(key)
    if (firstIndex !== undefined) {
      return `Player ${index + 1} has the same name as player ${firstIndex + 1}. Add an initial to tell them apart.`
    }
    seen.set(key, index)
    return undefined
  })

  const lane = lanes.find((candidate) => candidate.id === input.laneId)
  if (!input.laneId) errors.lane = 'Select a lane.'
  else if (!lane) errors.lane = 'The selected lane does not exist.'
  else if (lane.status !== 'available') {
    errors.lane = `Lane ${lane.laneNumber} is no longer available. Choose another lane.`
  }

  const start = new Date(input.startTime).getTime()
  if (!input.startTime || Number.isNaN(start)) {
    errors.startTime = 'Enter a start time.'
  } else {
    const minutesFromNow = (start - now.getTime()) / 60_000
    if (minutesFromNow > MAX_START_MINUTES_AHEAD) {
      errors.startTime = `The start time can be at most ${MAX_START_MINUTES_AHEAD} minutes from now.`
    } else if (minutesFromNow < -MAX_START_MINUTES_AGO) {
      errors.startTime = `The start time can be at most ${MAX_START_MINUTES_AGO / 60} hours ago.`
    }
  }

  return errors
}

/** Every message, in form order. */
export function errorMessages(errors: NewGameErrors): string[] {
  return [
    errors.groupName,
    errors.playerCount,
    ...errors.players,
    errors.lane,
    errors.startTime,
  ].filter((message): message is string => Boolean(message))
}
