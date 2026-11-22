'use client'

import { useEffect, useMemo, useState } from 'react'
import { BowlerDisplay, buildDemoTimeline, DEMO_SCENARIOS, EVENT_THEMES } from '@/features/bowler-display'
import type { BowlingEventType, DisplayMode, GameState } from '@/features/bowler-display'

/**
 * DEVELOPER-ONLY test console for the Bowler Display. It lives on its own route
 * so no simulation controls ever appear on the customer-facing /on-lane or
 * /overhead screens. It drives the same display with demo data.
 */

const SPEEDS = [1, 2, 4, 8]
const EVENT_TYPES = Object.keys(EVENT_THEMES) as BowlingEventType[]

const buttonClass =
  'rounded-md border border-white/15 bg-white/8 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/15 aria-pressed:border-brand-rose aria-pressed:bg-brand-rose/30'

export default function BowlerDisplayDevPage() {
  const [scenario, setScenario] = useState<number>(14)
  const [mode, setMode] = useState<DisplayMode>('on-lane')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(2)
  const [forced, setForced] = useState<{ id: string; type: BowlingEventType } | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  const timeline = useMemo(() => buildDemoTimeline(scenario), [scenario])
  const last = timeline.length - 1

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setStep((current) => {
        if (current >= last) {
          setPlaying(false)
          return current
        }
        return current + 1
      })
    }, 1500 / speed)
    return () => clearInterval(id)
  }, [playing, speed, last])

  const base = timeline[Math.min(step, last)]
  const game: GameState = forced
    ? { ...base, latestEvent: { ...forced, playerNumber: base.activePlayerNumber } }
    : base

  const jumpToFrame = (frame: number) => {
    const index = timeline.findIndex((state) => state.currentFrame === frame && state.status === 'in-progress')
    if (index >= 0) setStep(index)
  }

  return (
    <>
      <BowlerDisplay displayMode={mode} laneId="07" game={game} />

      <div className="fixed bottom-2 left-2 z-[100] max-w-[min(96vw,1100px)] rounded-lg border border-white/15 bg-black/85 p-2 text-white shadow-2xl backdrop-blur">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold tracking-widest text-brand-coral uppercase">Dev console</p>
          <button className={buttonClass} onClick={() => setCollapsed((value) => !value)}>
            {collapsed ? 'Show' : 'Hide'}
          </button>
          <span className="text-xs text-secondary tabular-nums">
            step {Math.min(step, last)}/{last} · frame {game.currentFrame} · {game.stage}
          </span>
        </div>

        {!collapsed && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-secondary">Players</span>
              {DEMO_SCENARIOS.map((size) => (
                <button
                  key={size}
                  aria-pressed={scenario === size}
                  className={buttonClass}
                  onClick={() => {
                    setScenario(size)
                    setStep(0)
                    setForced(null)
                  }}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xs text-secondary">Mode</span>
              {(['on-lane', 'overhead'] as const).map((value) => (
                <button key={value} aria-pressed={mode === value} className={buttonClass} onClick={() => setMode(value)}>
                  {value}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button className={buttonClass} onClick={() => setPlaying((value) => !value)}>
                {playing ? 'Pause' : 'Play'}
              </button>
              <button className={buttonClass} onClick={() => setStep((s) => Math.max(0, s - 1))}>◀</button>
              <button className={buttonClass} onClick={() => setStep((s) => Math.min(last, s + 1))}>▶</button>
              {SPEEDS.map((value) => (
                <button key={value} aria-pressed={speed === value} className={buttonClass} onClick={() => setSpeed(value)}>
                  {value}x
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xs text-secondary">Jump</span>
              <button className={buttonClass} onClick={() => setStep(0)}>Start</button>
              <button className={buttonClass} onClick={() => jumpToFrame(5)}>Frame 5</button>
              <button className={buttonClass} onClick={() => jumpToFrame(10)}>Frame 10</button>
              <button className={buttonClass} onClick={() => setStep(last - 1)}>Last throw</button>
              <button className={buttonClass} onClick={() => setStep(last)}>End</button>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <span className="text-xs text-secondary">Preview event</span>
              {EVENT_TYPES.map((type) => (
                <button
                  key={type}
                  className={buttonClass}
                  onClick={() => setForced({ id: `forced-${Date.now()}`, type })}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
