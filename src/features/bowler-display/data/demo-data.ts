/**
 * DEMO ONLY. Builds a deterministic, realistic game timeline so the display can
 * be shown and tested without a backend. Every entry is a full `GameState`
 * snapshot, exactly the shape the real scoring backend would supply.
 */
import { cumulativeScores, isFrameComplete } from './demo-scoring'
import type {
  BowlingEvent,
  Delivery,
  Frame,
  GameState,
  PinDetection,
  Player,
  ScoringStage,
} from '../types/bowling-display.types'

export const DEMO_SCENARIOS = [1, 5, 7, 10, 14] as const
export type DemoScenario = (typeof DEMO_SCENARIOS)[number]

const NAMES = [
  'Alex Rivera', 'Maya Chen', 'Jordan Blake', 'Priya Nair', 'Sam Okafor', 'Lena Fischer', 'Diego Morales',
  'Aiko Tanaka', 'Noah Bennett', 'Zara Ahmed', 'Luca Romano', 'Ivy Thompson', 'Omar Haddad', 'Nina Kowalski',
]

type Rack = boolean[] // index 0 = pin 1; true = standing

interface DemoThrow {
  pins: number
  foul: boolean
  after: Rack
}

interface ScriptedThrow {
  pins: number
  foul?: boolean
  /** Pins left standing, to produce a specific leave (e.g. a split). */
  leave?: number[]
}

const fullRack = (): Rack => Array<boolean>(10).fill(true)
const standingCount = (rack: Rack) => rack.filter(Boolean).length

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Which pins touch which, used only to recognise a split in the demo.
const ADJACENT: Record<number, number[]> = {
  1: [2, 3], 2: [1, 3, 4, 5], 3: [1, 2, 5, 6], 4: [2, 5, 7, 8], 5: [2, 3, 4, 6, 8, 9],
  6: [3, 5, 9, 10], 7: [4, 8], 8: [4, 5, 7, 9], 9: [5, 6, 8, 10], 10: [6, 9],
}

function isSplit(rack: Rack): boolean {
  if (rack[0]) return false
  const remaining = rack.flatMap((standing, index) => (standing ? [index + 1] : []))
  if (remaining.length < 2) return false
  const seen = new Set<number>([remaining[0]])
  const queue = [remaining[0]]
  while (queue.length > 0) {
    const pin = queue.pop() as number
    for (const next of ADJACENT[pin]) {
      if (remaining.includes(next) && !seen.has(next)) {
        seen.add(next)
        queue.push(next)
      }
    }
  }
  return seen.size < remaining.length
}

function throwPins(rack: Rack, scripted: ScriptedThrow | undefined, rng: () => number, skill: number): DemoThrow {
  const standing = standingCount(rack)
  const after = [...rack]

  if (scripted?.foul) return { pins: 0, foul: true, after }

  if (scripted?.leave) {
    rack.forEach((isUp, index) => {
      if (isUp && !scripted.leave?.includes(index + 1)) after[index] = false
    })
    return { pins: standing - standingCount(after), foul: false, after }
  }

  let knocked: number
  if (scripted) knocked = Math.min(scripted.pins, standing)
  else if (standing === 10) {
    const roll = rng()
    if (roll < 0.1 + skill * 0.38) knocked = 10
    else if (roll < 0.14 + skill * 0.38) knocked = 0
    else knocked = Math.min(9, Math.max(1, Math.round(5 + skill * 3 + (rng() - 0.5) * 4)))
  } else if (rng() < 0.2 + skill * 0.4) knocked = standing
  else knocked = Math.floor(rng() * standing)

  const upPins = rack.flatMap((isUp, index) => (isUp ? [index] : []))
  for (let i = upPins.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[upPins[i], upPins[j]] = [upPins[j], upPins[i]]
  }
  upPins.slice(0, knocked).forEach((index) => (after[index] = false))
  return { pins: knocked, foul: false, after }
}

function playFrame(frameIndex: number, rng: () => number, skill: number, script?: ScriptedThrow[]): DemoThrow[] {
  const throws: DemoThrow[] = []
  let rack = fullRack()
  const roll = (n: number) => {
    const next = throwPins(rack, script?.[n], rng, skill)
    throws.push(next)
    return next
  }
  const settle = (t: DemoThrow) => {
    rack = standingCount(t.after) === 0 ? fullRack() : t.after
    return standingCount(t.after) === 0
  }

  if (frameIndex < 9) {
    const first = roll(0)
    if (!settle(first)) roll(1)
    return throws
  }

  const cleared1 = settle(roll(0))
  const cleared2 = settle(roll(1))
  if (cleared1 || cleared2) roll(2)
  return throws
}

function scriptFor(scenario: number, player: number, frame: number): ScriptedThrow[] | undefined {
  if (scenario === 1) return [{ pins: 10 }, { pins: 10 }] // perfect game: every roll a strike
  if (player === 1 && frame <= 3) return [{ pins: 10 }] // opening turkey
  if (player === 2 && frame === 1) return [{ pins: 9 }, { pins: 1 }] // spare
  if (player === 2 && frame === 2) return [{ pins: 0 }, { pins: 7 }] // gutter
  if (player === 2 && frame === 3) return [{ pins: 0, foul: true }, { pins: 6 }] // foul
  if (player === 3 && frame === 2) return [{ pins: 8, leave: [7, 10] }, { pins: 1 }] // 7-10 split
  if (player === 4 && frame === 4) return [{ pins: 7, leave: [4, 6, 10] }, { pins: 2 }] // split
  return undefined
}

function generateGame(scenario: number): DemoThrow[][][] {
  const rng = mulberry32(1025 + scenario)
  return Array.from({ length: scenario }, (_, p) => {
    const skill = scenario === 1 ? 1 : 0.3 + rng() * 0.65
    return Array.from({ length: 10 }, (_, f) => {
      const script =
        scenario === 1
          ? Array.from({ length: f === 9 ? 3 : 1 }, () => ({ pins: 10 }))
          : scriptFor(scenario, p + 1, f + 1)
      return playFrame(f, rng, skill, script)
    })
  })
}

interface BuildArgs {
  rolls: DemoThrow[][][]
  unconfirmed: { p: number; f: number } | null
  stage: ScoringStage
  active: { p: number; f: number } | null
  pins: PinDetection
  event: BowlingEvent | null
  status: GameState['status']
}

function snapshot({ rolls, unconfirmed, stage, active, pins, event, status }: BuildArgs): GameState {
  const players: Player[] = rolls.map((playerFrames, p) => {
    const deliveries: Delivery[][] = playerFrames.map((frameThrows, f) =>
      frameThrows.map((t, i) => ({
        pins: t.pins,
        foul: t.foul,
        confirmed: !(unconfirmed && unconfirmed.p === p && unconfirmed.f === f && i === frameThrows.length - 1),
      })),
    )
    const scores = cumulativeScores(deliveries.map((frame) => frame.filter((d) => d.confirmed).map((d) => d.pins)))
    const frames: Frame[] = deliveries.map((frameDeliveries, f) => ({
      number: f + 1,
      deliveries: frameDeliveries,
      isComplete: isFrameComplete(f, frameDeliveries.map((d) => d.pins)),
      score: scores[f],
    }))
    return {
      number: p + 1,
      name: NAMES[p],
      frames,
      totalScore: scores.findLast((score) => score !== null) ?? 0,
    }
  })

  return {
    gameId: '1025',
    status,
    players,
    activePlayerNumber: active ? active.p + 1 : null,
    currentFrame: active ? active.f + 1 : 10,
    stage,
    pins,
    latestEvent: event,
  }
}

/** Every step of a full game: for each delivery, one "registered" and one "confirmed" snapshot. */
export function buildDemoTimeline(scenario: number): GameState[] {
  const game = generateGame(scenario)
  const rolls: DemoThrow[][][] = game.map(() => Array.from({ length: 10 }, () => []))
  const strikeStreak = Array<number>(scenario).fill(0)
  const strikeTotal = Array<number>(scenario).fill(0)
  const timeline: GameState[] = []

  const pending = (rack: Rack): PinDetection => ({ status: 'pending', standing: rack })
  const detected = (rack: Rack): PinDetection => ({ status: 'detected', standing: rack })

  timeline.push(
    snapshot({
      rolls, unconfirmed: null, stage: 'awaiting-first-delivery',
      active: { p: 0, f: 0 }, pins: pending(fullRack()), event: null, status: 'in-progress',
    }),
  )

  let eventCount = 0
  for (let f = 0; f < 10; f++) {
    for (let p = 0; p < scenario; p++) {
      const frameThrows = game[p][f]
      let rackBefore = fullRack()

      for (let k = 0; k < frameThrows.length; k++) {
        const t = frameThrows[k]
        rolls[p][f].push(t)

        const fresh = standingCount(rackBefore) === 10
        const cleared = standingCount(t.after) === 0
        const frameDone = isFrameComplete(f, rolls[p][f].map((x) => x.pins))
        const isLastThrow = f === 9 && p === scenario - 1 && frameDone

        // Event for this delivery, highest priority first.
        let type: BowlingEvent['type'] | null = null
        if (t.foul) type = 'foul'
        else if (fresh && cleared) {
          strikeStreak[p]++
          strikeTotal[p]++
          type = strikeTotal[p] === 12 ? 'perfect-game' : strikeStreak[p] === 3 ? 'turkey' : strikeStreak[p] === 2 ? 'double' : 'strike'
        } else if (cleared) type = 'spare'
        else if (fresh && t.after[6] && t.after[9] && standingCount(t.after) === 2 && !t.after[0]) type = 'split-7-10'
        else if (fresh && isSplit(t.after)) type = 'split'
        else if (t.pins === 0) type = 'gutter'
        if (!(fresh && cleared) && !t.foul) strikeStreak[p] = 0
        if (t.foul) strikeStreak[p] = 0

        const event: BowlingEvent | null = type
          ? { id: `evt-${++eventCount}`, type, playerNumber: p + 1 }
          : null

        const stageA: ScoringStage = frameDone
          ? 'frame-completed'
          : k === 0
            ? 'first-delivery-completed'
            : 'second-delivery-completed'

        // 1) Delivery registered, result not yet confirmed.
        timeline.push(
          snapshot({
            rolls, unconfirmed: { p, f }, stage: stageA, active: { p, f },
            pins: detected(t.after), event, status: 'in-progress',
          }),
        )

        // 2) Result confirmed; the game moves on.
        const nextRack = cleared ? fullRack() : t.after
        if (isLastThrow) {
          timeline.push(
            snapshot({
              rolls, unconfirmed: null, stage: 'game-completed', active: null,
              pins: pending(fullRack()),
              event: { id: `evt-${++eventCount}`, type: 'game-completed', playerNumber: null },
              status: 'completed',
            }),
          )
        } else if (frameDone) {
          const nextP = p + 1 < scenario ? p + 1 : 0
          const nextF = p + 1 < scenario ? f : f + 1
          timeline.push(
            snapshot({
              rolls, unconfirmed: null, stage: 'preparing-next-player', active: { p: nextP, f: nextF },
              pins: pending(fullRack()), event, status: 'in-progress',
            }),
          )
        } else {
          timeline.push(
            snapshot({
              rolls, unconfirmed: null, stage: k === 0 ? 'awaiting-second-delivery' : 'awaiting-third-delivery',
              active: { p, f }, pins: cleared ? pending(nextRack) : detected(nextRack), event, status: 'in-progress',
            }),
          )
        }
        rackBefore = nextRack
      }
    }
  }

  return timeline
}
