import { createInitialState } from '../data/mock-front-desk-data'
import type { FrontDeskState } from '../types/front-desk.types'
import { FRONT_DESK_STORAGE_KEY, loadFrontDeskState, parseStoredState, saveFrontDeskState } from './front-desk-storage'
import type { CommandResult } from './front-desk-transitions'

/**
 * Browser-only store holding the Front Desk prototype state, read through
 * `useSyncExternalStore`. It is never touched during server rendering: the
 * server snapshot is null, and the state is created (from localStorage or the
 * mock data, relative to the current time) on first read in the browser.
 */

type Listener = () => void

let state: FrontDeskState | null = null
const listeners = new Set<Listener>()

function read(): FrontDeskState {
  if (state) return state
  const stored = loadFrontDeskState()
  if (stored) {
    state = stored
  } else {
    // First visit in this browser: save the mock data so refreshes and other tabs share it.
    state = createInitialState(new Date())
    saveFrontDeskState(state)
  }
  return state
}

function publish(next: FrontDeskState, persist: boolean) {
  state = next
  if (persist) saveFrontDeskState(next)
  for (const listener of listeners) listener()
}

// Keep several open Front Desk tabs in step.
function onStorage(event: StorageEvent) {
  if (event.key !== FRONT_DESK_STORAGE_KEY) return
  const incoming = parseStoredState(event.newValue)
  if (incoming) publish(incoming, false)
}

export const frontDeskStore = {
  subscribe(listener: Listener) {
    if (listeners.size === 0) window.addEventListener('storage', onStorage)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
      if (listeners.size === 0) window.removeEventListener('storage', onStorage)
    }
  },
  getSnapshot: read,
  getServerSnapshot: (): FrontDeskState | null => null,

  /** Runs a transition against the latest state; stores and saves the result if it succeeded. */
  apply<T>(command: (current: FrontDeskState, at: Date) => CommandResult<T>): CommandResult<T> {
    const at = new Date()
    const result = command(read(), at)
    if (result.ok) {
      clock.tick(at)
      publish(result.state, true)
    }
    return result
  },

  reset() {
    const at = new Date()
    clock.tick(at)
    publish(createInitialState(at), true)
  },
}

/** How often elapsed times refresh. */
const CLOCK_INTERVAL_MS = 15_000

let now: Date | null = null
let timer: number | undefined
const clockListeners = new Set<Listener>()

/** A shared "current time" that refreshes regularly while anything is subscribed. */
export const clock = {
  subscribe(listener: Listener) {
    clockListeners.add(listener)
    if (timer === undefined) {
      timer = window.setInterval(() => clock.tick(new Date()), CLOCK_INTERVAL_MS)
    }
    return () => {
      clockListeners.delete(listener)
      if (clockListeners.size === 0) {
        window.clearInterval(timer)
        timer = undefined
      }
    }
  },
  getSnapshot(): Date {
    now ??= new Date()
    return now
  },
  getServerSnapshot: (): Date | null => null,
  tick(at: Date) {
    now = at
    for (const listener of clockListeners) listener()
  },
}
