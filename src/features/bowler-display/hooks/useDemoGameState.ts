'use client'

import { useEffect, useMemo, useState } from 'react'
import { buildDemoTimeline } from '../data/demo-data'
import type { GameState } from '../types/bowling-display.types'

/** Extra ticks the finished game stays on screen before the demo restarts. */
const HOLD_TICKS = 10

interface UseDemoGameStateOptions {
  /** Number of players in the demo game. */
  scenario: number
  /** Pin the demo to one step instead of playing it. */
  step?: number
  tickMs?: number
}

/**
 * DEMO ONLY. Stands in for the live game feed until the scoring backend is
 * connected: it replays a prepared game. Playback follows the wall clock, so
 * two screens (On-Lane and Overhead) opened with the same scenario show the
 * same state at the same moment.
 *
 * To go live, replace this hook with one that returns the backend's `GameState`.
 */
export function useDemoGameState({ scenario, step, tickMs = 1500 }: UseDemoGameStateOptions): GameState | null {
  const timeline = useMemo(() => buildDemoTimeline(scenario), [scenario])
  const last = timeline.length - 1
  const [clockIndex, setClockIndex] = useState<number | null>(null)

  useEffect(() => {
    if (step !== undefined) return
    const cycle = timeline.length + HOLD_TICKS
    const update = () => setClockIndex(Math.min(Math.floor(Date.now() / tickMs) % cycle, last))
    const first = setTimeout(update, 0)
    const interval = setInterval(update, 250)
    return () => {
      clearTimeout(first)
      clearInterval(interval)
    }
  }, [timeline, last, step, tickMs])

  if (step !== undefined) return timeline[Math.min(Math.max(step, 0), last)]
  return clockIndex === null ? null : timeline[Math.min(clockIndex, last)]
}
