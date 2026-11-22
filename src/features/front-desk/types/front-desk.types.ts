/**
 * Front Desk prototype data model.
 *
 * PROTOTYPE ONLY: there is no front-desk backend yet. These types describe the
 * mock state held in the browser; they are not a production API contract.
 */

export const LANE_STATUSES = ['available', 'occupied', 'reserved', 'cleaning', 'maintenance'] as const
export type LaneStatus = (typeof LANE_STATUSES)[number]

/** Statuses staff can set by hand. Occupied and reserved follow from games. */
export type ManualLaneStatus = Extract<LaneStatus, 'available' | 'cleaning' | 'maintenance'>

export const SESSION_TYPES = ['walk-in', 'reservation'] as const
export type SessionType = (typeof SESSION_TYPES)[number]

/**
 * - waiting: a reservation booked on a lane, not yet checked in
 * - in-progress: bowling now
 * - completed / cancelled: finished, kept in game history
 */
export const GAME_STATUSES = ['waiting', 'in-progress', 'completed', 'cancelled'] as const
export type GameStatus = (typeof GAME_STATUSES)[number]

export type FinishedGameStatus = Extract<GameStatus, 'completed' | 'cancelled'>

export interface Player {
  id: string
  name: string
}

export interface Lane {
  id: string
  laneNumber: number
  status: LaneStatus
  /** The game on the lane: the active game when occupied, the reservation when reserved. */
  currentGameId: string | null
  /** Staff note, e.g. the reason a lane is under maintenance. */
  notes: string
}

export interface Game {
  id: string
  /** Human-readable, unique number shown to staff and customers, e.g. "G-1047". */
  gameNumber: string
  sessionType: SessionType
  /** Optional; empty when the group gave no name. */
  groupName: string
  laneId: string
  players: Player[]
  /** ISO timestamp. For a waiting reservation this is the booked start time. */
  startTime: string
  /** ISO timestamp when the game ended or the reservation was cancelled. */
  endTime: string | null
  status: GameStatus
}

export type ActivityKind =
  | 'game-started'
  | 'game-ended'
  | 'reservation-checked-in'
  | 'reservation-cancelled'
  | 'lane-cleaning'
  | 'lane-available'
  | 'lane-maintenance'

export interface ActivityEntry {
  id: string
  kind: ActivityKind
  message: string
  /** ISO timestamp. */
  at: string
}

export const FRONT_DESK_SCHEMA_VERSION = 1

export interface FrontDeskState {
  schemaVersion: typeof FRONT_DESK_SCHEMA_VERSION
  lanes: Lane[]
  /** Booked sessions waiting to start (status "waiting"). */
  reservations: Game[]
  /** Games being bowled now (status "in-progress"). */
  activeGames: Game[]
  /** Completed or cancelled games, newest first. */
  gameHistory: Game[]
  /** Newest first. */
  activity: ActivityEntry[]
  /** Next number used to build a unique game number. */
  nextGameSequence: number
  nextActivitySequence: number
}

export interface NewGameInput {
  sessionType: SessionType
  groupName: string
  playerNames: string[]
  laneId: string
  /** ISO timestamp. */
  startTime: string
}
