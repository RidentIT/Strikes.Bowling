import { useEffect, useRef, useState } from 'react'
import { EVENT_THEMES } from '../config/event-themes'
import type { BowlingEvent } from '../types/bowling-display.types'

/**
 * Turns the game state's `latestEvent` into a short-lived "active" event for
 * the animation layer. Each event (by id) triggers once, however many times
 * the component re-renders, and an event already present when the display
 * loads is ignored so a reload never replays an old celebration.
 */
export function useBowlingEvents(latestEvent: BowlingEvent | null): BowlingEvent | null {
  const [activeEvent, setActiveEvent] = useState<BowlingEvent | null>(null)
  const handledId = useRef<string | null | undefined>(undefined)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (handledId.current === undefined) {
      handledId.current = latestEvent?.id ?? null
      return
    }
    if (!latestEvent || latestEvent.id === handledId.current) return

    handledId.current = latestEvent.id
    clearTimeout(timer.current)
    setActiveEvent(latestEvent)
    timer.current = setTimeout(() => {
      setActiveEvent((current) => (current?.id === latestEvent.id ? null : current))
    }, EVENT_THEMES[latestEvent.type].durationMs)
  }, [latestEvent])

  useEffect(() => () => clearTimeout(timer.current), [])

  return activeEvent
}
