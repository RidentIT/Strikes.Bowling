import { pluralize } from '../lib/format'
import { formatGameNumber } from '../state/front-desk-transitions'
import {
  FRONT_DESK_SCHEMA_VERSION,
  type ActivityEntry,
  type ActivityKind,
  type FrontDeskState,
  type Game,
  type GameStatus,
  type Lane,
  type LaneStatus,
  type SessionType,
} from '../types/front-desk.types'

/**
 * MOCK DATA for the Front Desk prototype. There is no front-desk backend yet;
 * this is the starting state for a fresh browser session. Times are relative to
 * `now`, so the alley always looks like a normal evening in progress.
 */

const MINUTE = 60_000
const LANE_COUNT = 12

const NAME_POOL = [
  'Kasun', 'Dilini', 'Ravindu', 'Nethmi', 'Tharindu', 'Sachini', 'Amal', 'Ishara',
  'Chamod', 'Hiruni', 'Ashen', 'Malki', 'Dinuk', 'Senuli', 'Pasindu', 'Tharushi',
  'Lahiru', 'Kavindi', 'Yasiru', 'Oshadi', 'Ruwan', 'Imesha', 'Janith', 'Piumi',
  'Sahan', 'Nadeesha', 'Vihanga', 'Chathu', 'Minura', 'Dulmi', 'Akila', 'Sanduni',
]

interface GameSeed {
  lane: number
  group: string
  type: SessionType
  players: number
  /** Minutes from now the game started (negative = in the past) or is booked for. */
  start: number
  /** Minutes from now the game ended or was cancelled; omitted while not finished. */
  end?: number
  status: GameStatus
}

const HISTORY: GameSeed[] = [
  { lane: 2, group: 'Jayawardena Family', type: 'reservation', players: 5, start: -3195, end: -3100, status: 'completed' },
  { lane: 5, group: '', type: 'walk-in', players: 2, start: -3098, end: -3050, status: 'completed' },
  { lane: 8, group: 'Finance Team Social', type: 'reservation', players: 9, start: -3080, end: -2960, status: 'completed' },
  { lane: 1, group: 'Wickramasinghe', type: 'walk-in', players: 3, start: -2962, end: -2900, status: 'completed' },
  { lane: 12, group: 'Saturday League', type: 'reservation', players: 6, start: -1810, end: -1700, status: 'completed' },
  { lane: 3, group: '', type: 'walk-in', players: 1, start: -1685, end: -1650, status: 'completed' },
  { lane: 6, group: 'Gunasekara Birthday', type: 'reservation', players: 8, start: -1560, end: -1600, status: 'cancelled' },
  { lane: 10, group: 'University Club', type: 'walk-in', players: 11, start: -1650, end: -1520, status: 'completed' },
  { lane: 2, group: 'Mendis & Friends', type: 'walk-in', players: 4, start: -1510, end: -1440, status: 'completed' },
  { lane: 7, group: '', type: 'walk-in', players: 2, start: -355, end: -300, status: 'completed' },
  { lane: 4, group: "Senuli's Party", type: 'reservation', players: 14, start: -285, end: -180, status: 'completed' },
  { lane: 8, group: 'Herath', type: 'walk-in', players: 3, start: -178, end: -120, status: 'completed' },
  { lane: 12, group: 'Design Team Offsite', type: 'reservation', players: 7, start: -150, end: -60, status: 'completed' },
  { lane: 5, group: '', type: 'walk-in', players: 2, start: -65, end: -25, status: 'completed' },
]

const ACTIVE: GameSeed[] = [
  { lane: 1, group: 'Perera Family', type: 'walk-in', players: 4, start: -35, status: 'in-progress' },
  { lane: 3, group: "Nethmi's Birthday", type: 'reservation', players: 7, start: -52, status: 'in-progress' },
  { lane: 6, group: '', type: 'walk-in', players: 2, start: -12, status: 'in-progress' },
  { lane: 10, group: 'Corporate League', type: 'reservation', players: 5, start: -78, status: 'in-progress' },
]

const RESERVATIONS: GameSeed[] = [
  { lane: 7, group: 'Tech Meetup Social', type: 'reservation', players: 10, start: 40, status: 'waiting' },
  { lane: 11, group: 'Fernando Party', type: 'reservation', players: 6, start: 95, status: 'waiting' },
]

/** Lanes not holding a game, with their state and note. */
const OTHER_LANES: Partial<Record<number, { status: LaneStatus; notes: string }>> = {
  4: { status: 'cleaning', notes: '' },
  9: { status: 'maintenance', notes: 'Pinsetter jam. Technician notified.' },
}

const laneId = (laneNumber: number) => `lane-${laneNumber}`

export function createInitialState(now: Date): FrontDeskState {
  const at = (minutes: number) => new Date(now.getTime() + minutes * MINUTE).toISOString()

  let sequence = 1027
  let nameOffset = 0
  const buildGame = (seed: GameSeed): Game => {
    const id = `game-${sequence}`
    const players = Array.from({ length: seed.players }, (_, index) => ({
      id: `${id}-player-${index + 1}`,
      name: NAME_POOL[(nameOffset + index) % NAME_POOL.length],
    }))
    nameOffset += 5
    const game: Game = {
      id,
      gameNumber: formatGameNumber(sequence),
      sessionType: seed.type,
      groupName: seed.group,
      laneId: laneId(seed.lane),
      players,
      startTime: at(seed.start),
      endTime: seed.end === undefined ? null : at(seed.end),
      status: seed.status,
    }
    sequence += 1
    return game
  }

  const gameHistory = HISTORY.map(buildGame).reverse()
  const activeGames = ACTIVE.map(buildGame)
  const reservations = RESERVATIONS.map(buildGame)

  const lanes: Lane[] = Array.from({ length: LANE_COUNT }, (_, index) => {
    const number = index + 1
    const active = activeGames.find((game) => game.laneId === laneId(number))
    const reserved = reservations.find((game) => game.laneId === laneId(number))
    const other = OTHER_LANES[number]
    return {
      id: laneId(number),
      laneNumber: number,
      status: active ? 'occupied' : reserved ? 'reserved' : (other?.status ?? 'available'),
      currentGameId: active?.id ?? reserved?.id ?? null,
      notes: other?.notes ?? '',
    }
  })

  const laneNumberOf = (game: Game) => Number(game.laneId.replace('lane-', ''))
  const describe = (game: Game) => `${game.gameNumber} ${game.status === 'in-progress' ? 'started' : 'ended'} on Lane ${laneNumberOf(game)}${game.groupName ? ` · ${game.groupName}` : ''}`
  const event = (kind: ActivityKind, message: string, time: string): Omit<ActivityEntry, 'id'> => ({ kind, message, at: time })
  const events = [
    ...gameHistory.slice(0, 4).map((game) => event('game-ended', describe(game), game.endTime ?? game.startTime)),
    ...activeGames.map((game) =>
      event('game-started', `${describe(game)} · ${pluralize(game.players.length, 'player')}`, game.startTime),
    ),
    event('lane-maintenance', 'Lane 9 under maintenance: Pinsetter jam. Technician notified.', at(-90)),
    event('lane-cleaning', 'Lane 4 marked for cleaning', at(-176)),
  ]
  const activity = events
    .sort((a, b) => b.at.localeCompare(a.at))
    .map((entry, index) => ({ ...entry, id: `activity-${events.length - index}` }))

  return {
    schemaVersion: FRONT_DESK_SCHEMA_VERSION,
    lanes,
    reservations,
    activeGames,
    gameHistory,
    activity,
    nextGameSequence: sequence,
    nextActivitySequence: events.length + 1,
  }
}
