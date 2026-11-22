import { errorMessages, validateNewGame } from '../lib/new-game-validation'
import { pluralize } from '../lib/format'
import type {
  ActivityKind,
  FrontDeskState,
  Game,
  Lane,
  LaneStatus,
  ManualLaneStatus,
  NewGameInput,
} from '../types/front-desk.types'

/**
 * Every change to the Front Desk state goes through these pure functions, so
 * a game, its lane, the history and the activity log always change together.
 * A command that isn't allowed returns an error and leaves the state as is.
 */

export type CommandResult<T> =
  | { ok: true; state: FrontDeskState; value: T }
  | { ok: false; error: string }

const MAX_ACTIVITY_ENTRIES = 40

/** Statuses staff may set by hand, by current status. Occupied and reserved lanes change through their game. */
export const MANUAL_LANE_TRANSITIONS: Record<LaneStatus, readonly ManualLaneStatus[]> = {
  available: ['cleaning', 'maintenance'],
  cleaning: ['available', 'maintenance'],
  maintenance: ['available'],
  occupied: [],
  reserved: [],
}

export const formatGameNumber = (sequence: number) => `G-${sequence}`

const fail = (error: string): { ok: false; error: string } => ({ ok: false, error })

function succeed<T>(state: FrontDeskState, value: T): CommandResult<T> {
  return { ok: true, state, value }
}

function updateLane(lanes: Lane[], laneId: string, patch: Partial<Omit<Lane, 'id' | 'laneNumber'>>): Lane[] {
  return lanes.map((lane) => (lane.id === laneId ? { ...lane, ...patch } : lane))
}

function logActivity(state: FrontDeskState, kind: ActivityKind, message: string, at: Date): FrontDeskState {
  const entry = { id: `activity-${state.nextActivitySequence}`, kind, message, at: at.toISOString() }
  return {
    ...state,
    activity: [entry, ...state.activity].slice(0, MAX_ACTIVITY_ENTRIES),
    nextActivitySequence: state.nextActivitySequence + 1,
  }
}

const describeGroup = (game: Game) => (game.groupName ? ` · ${game.groupName}` : '')

export function createGame(state: FrontDeskState, input: NewGameInput, now: Date): CommandResult<Game> {
  const [firstError] = errorMessages(validateNewGame(input, state.lanes, now))
  if (firstError) return fail(firstError)

  const lane = state.lanes.find((candidate) => candidate.id === input.laneId)
  if (!lane) return fail('Select a lane.')

  const sequence = state.nextGameSequence
  const id = `game-${sequence}`
  const gameNumber = formatGameNumber(sequence)
  const allGames = [...state.reservations, ...state.activeGames, ...state.gameHistory]
  if (allGames.some((game) => game.id === id || game.gameNumber === gameNumber)) {
    return fail('Could not generate a unique game number. Reset the prototype data and try again.')
  }

  const game: Game = {
    id,
    gameNumber,
    sessionType: input.sessionType,
    groupName: input.groupName.trim(),
    laneId: lane.id,
    players: input.playerNames.map((name, index) => ({ id: `${id}-player-${index + 1}`, name: name.trim() })),
    startTime: new Date(input.startTime).toISOString(),
    endTime: null,
    status: 'in-progress',
  }

  const next: FrontDeskState = {
    ...state,
    lanes: updateLane(state.lanes, lane.id, { status: 'occupied', currentGameId: id, notes: '' }),
    activeGames: [...state.activeGames, game],
    nextGameSequence: sequence + 1,
  }
  const message = `${gameNumber} started on Lane ${lane.laneNumber}${describeGroup(game)} · ${pluralize(game.players.length, 'player')}`
  return succeed(logActivity(next, 'game-started', message, now), game)
}

export function endGame(state: FrontDeskState, gameId: string, now: Date): CommandResult<Game> {
  const game = state.activeGames.find((candidate) => candidate.id === gameId)
  if (!game) return fail('This game is not active. It may already have ended.')

  const completed: Game = { ...game, status: 'completed', endTime: now.toISOString() }
  const lane = state.lanes.find((candidate) => candidate.id === game.laneId)
  const lanes =
    lane && lane.currentGameId === game.id
      ? updateLane(state.lanes, lane.id, { status: 'available', currentGameId: null, notes: '' })
      : state.lanes

  const next: FrontDeskState = {
    ...state,
    lanes,
    activeGames: state.activeGames.filter((candidate) => candidate.id !== gameId),
    gameHistory: [completed, ...state.gameHistory],
  }
  const laneText = lane ? ` on Lane ${lane.laneNumber}` : ''
  return succeed(logActivity(next, 'game-ended', `${game.gameNumber} ended${laneText}${describeGroup(game)}`, now), completed)
}

export function checkInReservation(state: FrontDeskState, gameId: string, now: Date): CommandResult<Game> {
  const reservation = state.reservations.find((candidate) => candidate.id === gameId)
  if (!reservation) return fail('This reservation is no longer waiting.')

  const lane = state.lanes.find((candidate) => candidate.id === reservation.laneId)
  if (!lane || lane.status !== 'reserved' || lane.currentGameId !== reservation.id) {
    return fail('The reserved lane is not held for this booking.')
  }

  const started: Game = { ...reservation, status: 'in-progress', startTime: now.toISOString() }
  const next: FrontDeskState = {
    ...state,
    lanes: updateLane(state.lanes, lane.id, { status: 'occupied', currentGameId: started.id, notes: '' }),
    reservations: state.reservations.filter((candidate) => candidate.id !== gameId),
    activeGames: [...state.activeGames, started],
  }
  const message = `${started.gameNumber} checked in on Lane ${lane.laneNumber}${describeGroup(started)}`
  return succeed(logActivity(next, 'reservation-checked-in', message, now), started)
}

export function cancelReservation(state: FrontDeskState, gameId: string, now: Date): CommandResult<Game> {
  const reservation = state.reservations.find((candidate) => candidate.id === gameId)
  if (!reservation) return fail('This reservation is no longer waiting.')

  const cancelled: Game = { ...reservation, status: 'cancelled', endTime: now.toISOString() }
  const lane = state.lanes.find((candidate) => candidate.id === reservation.laneId)
  const lanes =
    lane && lane.currentGameId === reservation.id
      ? updateLane(state.lanes, lane.id, { status: 'available', currentGameId: null, notes: '' })
      : state.lanes

  const next: FrontDeskState = {
    ...state,
    lanes,
    reservations: state.reservations.filter((candidate) => candidate.id !== gameId),
    gameHistory: [cancelled, ...state.gameHistory],
  }
  const laneText = lane ? ` for Lane ${lane.laneNumber}` : ''
  return succeed(
    logActivity(next, 'reservation-cancelled', `Reservation ${reservation.gameNumber}${laneText} cancelled${describeGroup(reservation)}`, now),
    cancelled,
  )
}

const LANE_STATUS_ACTIVITY: Record<ManualLaneStatus, { kind: ActivityKind; verb: string }> = {
  available: { kind: 'lane-available', verb: 'is available' },
  cleaning: { kind: 'lane-cleaning', verb: 'marked for cleaning' },
  maintenance: { kind: 'lane-maintenance', verb: 'under maintenance' },
}

export function setLaneStatus(
  state: FrontDeskState,
  laneId: string,
  status: ManualLaneStatus,
  note: string,
  now: Date,
): CommandResult<Lane> {
  const lane = state.lanes.find((candidate) => candidate.id === laneId)
  if (!lane) return fail('This lane does not exist.')
  if (!MANUAL_LANE_TRANSITIONS[lane.status].includes(status)) {
    if (lane.status === 'occupied') return fail(`Lane ${lane.laneNumber} has a game in progress. End the game first.`)
    if (lane.status === 'reserved') return fail(`Lane ${lane.laneNumber} is reserved. Check in or cancel the reservation first.`)
    return fail(`Lane ${lane.laneNumber} can't go from ${lane.status} to ${status}.`)
  }

  const notes = status === 'maintenance' ? note.trim() : ''
  const updated: Lane = { ...lane, status, currentGameId: null, notes }
  const next: FrontDeskState = { ...state, lanes: updateLane(state.lanes, laneId, updated) }
  const { kind, verb } = LANE_STATUS_ACTIVITY[status]
  const message = `Lane ${lane.laneNumber} ${verb}${notes ? `: ${notes}` : ''}`
  return succeed(logActivity(next, kind, message, now), updated)
}
