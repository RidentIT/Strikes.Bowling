/**
 * The contract between the scoring backend and the Bowler Display.
 *
 * The display is purely presentational: every score, frame, status and event
 * below is supplied by the game state and rendered as-is. Nothing in the UI
 * calculates scores.
 */

export type DisplayMode = 'on-lane' | 'overhead'

export const FRAME_COUNT = 10
export const MAX_PLAYERS = 14

export interface Delivery {
  /** Pins knocked down by this delivery. */
  pins: number
  foul: boolean
  /** False while the result is registered but not yet confirmed. */
  confirmed: boolean
}

export interface Frame {
  /** 1–10. */
  number: number
  deliveries: Delivery[]
  isComplete: boolean
  /** Confirmed cumulative score through this frame; null until it can be determined. */
  score: number | null
}

export interface Player {
  /** 1-based position in the bowling order. */
  number: number
  name: string
  /** Always {@link FRAME_COUNT} entries; future frames have no deliveries. */
  frames: Frame[]
  /** Confirmed running total. */
  totalScore: number
}

export type ScoringStage =
  | 'awaiting-first-delivery'
  | 'first-delivery-completed'
  | 'awaiting-second-delivery'
  | 'second-delivery-completed'
  | 'awaiting-third-delivery'
  | 'frame-completed'
  | 'preparing-next-player'
  | 'game-completed'

export type PinDetectionStatus = 'detected' | 'pending' | 'unavailable'

export interface PinDetection {
  status: PinDetectionStatus
  /** Ten entries; index 0 is the head pin (pin 1). True when the pin is standing. */
  standing: boolean[]
}

export type BowlingEventType =
  | 'strike'
  | 'spare'
  | 'double'
  | 'turkey'
  | 'split'
  | 'split-7-10'
  | 'gutter'
  | 'foul'
  | 'perfect-game'
  | 'game-completed'

export interface BowlingEvent {
  /** Unique per occurrence; used to make sure an event animates only once. */
  id: string
  type: BowlingEventType
  playerNumber: number | null
}

export interface GameState {
  gameId: string
  status: 'in-progress' | 'completed'
  /** All players in bowling order (up to {@link MAX_PLAYERS}). */
  players: Player[]
  /** Null once the game is completed. */
  activePlayerNumber: number | null
  currentFrame: number
  stage: ScoringStage
  /** Null when no pin-detection data is available. */
  pins: PinDetection | null
  latestEvent: BowlingEvent | null
}
