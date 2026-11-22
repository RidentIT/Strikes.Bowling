'use client'

import { createContext, use, useMemo, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { clock, frontDeskStore } from '../state/front-desk-store'
import {
  cancelReservation,
  checkInReservation,
  createGame,
  endGame,
  setLaneStatus,
  type CommandResult,
} from '../state/front-desk-transitions'
import type { FrontDeskState, Game, Lane, ManualLaneStatus, NewGameInput } from '../types/front-desk.types'

export interface FrontDeskActions {
  createGame: (input: NewGameInput) => CommandResult<Game>
  endGame: (gameId: string) => CommandResult<Game>
  checkInReservation: (gameId: string) => CommandResult<Game>
  cancelReservation: (gameId: string) => CommandResult<Game>
  setLaneStatus: (laneId: string, status: ManualLaneStatus, note?: string) => CommandResult<Lane>
  /** Restores the original mock data. */
  resetPrototype: () => void
}

export interface FrontDeskContextValue {
  state: FrontDeskState
  /** Current time, refreshed regularly so elapsed durations stay current. */
  now: Date
  actions: FrontDeskActions
}

/** Every change goes through the pure transitions, so a game, its lane, the history and the dashboard stay consistent. */
const ACTIONS: FrontDeskActions = {
  createGame: (input) => frontDeskStore.apply((current, at) => createGame(current, input, at)),
  endGame: (gameId) => frontDeskStore.apply((current, at) => endGame(current, gameId, at)),
  checkInReservation: (gameId) => frontDeskStore.apply((current, at) => checkInReservation(current, gameId, at)),
  cancelReservation: (gameId) => frontDeskStore.apply((current, at) => cancelReservation(current, gameId, at)),
  setLaneStatus: (laneId, status, note = '') =>
    frontDeskStore.apply((current, at) => setLaneStatus(current, laneId, status, note, at)),
  resetPrototype: () => frontDeskStore.reset(),
}

const FrontDeskContext = createContext<FrontDeskContextValue | null>(null)

/**
 * Shares the single Front Desk state with every page. The state exists only in
 * the browser (null while prerendering), so pages render once it is available.
 */
export function FrontDeskProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(frontDeskStore.subscribe, frontDeskStore.getSnapshot, frontDeskStore.getServerSnapshot)
  const now = useSyncExternalStore(clock.subscribe, clock.getSnapshot, clock.getServerSnapshot)

  const value = useMemo(() => (state && now ? { state, now, actions: ACTIONS } : null), [state, now])

  return <FrontDeskContext value={value}>{children}</FrontDeskContext>
}

/** Front Desk state and actions. Only for components rendered once the state has loaded. */
export function useFrontDesk(): FrontDeskContextValue {
  const value = use(FrontDeskContext)
  if (!value) throw new Error('useFrontDesk must be used inside a loaded FrontDeskProvider.')
  return value
}

/** Null until the state has loaded in the browser. */
export function useOptionalFrontDesk(): FrontDeskContextValue | null {
  return use(FrontDeskContext)
}
