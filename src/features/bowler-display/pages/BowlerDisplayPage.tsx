import { Suspense } from 'react'
import { BowlerDisplayScreen } from '../BowlerDisplayScreen'
import { DEMO_SCENARIOS } from '../data/demo-data'
import type { DisplayMode } from '../types/bowling-display.types'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

interface BowlerDisplayPageProps {
  mode: DisplayMode
  searchParams: SearchParams
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

export function BowlerDisplayPage({ mode, searchParams }: BowlerDisplayPageProps) {
  // Search params are request-time data, so they're read inside a Suspense boundary.
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background" />}>
      <ConfiguredBowlerDisplay mode={mode} searchParams={searchParams} />
    </Suspense>
  )
}

/**
 * URL options (all optional):
 *   ?lane=07   lane shown in the header
 *   ?demo=14   demo game size: 1, 5, 7, 10 or 14 players (demo data only)
 *   ?step=120  hold the demo at one step instead of playing it
 */
async function ConfiguredBowlerDisplay({ mode, searchParams }: BowlerDisplayPageProps) {
  const params = await searchParams
  const demo = Number(first(params.demo))
  const step = first(params.step)

  return (
    <BowlerDisplayScreen
      displayMode={mode}
      laneId={first(params.lane) ?? '07'}
      scenario={DEMO_SCENARIOS.some((size) => size === demo) ? demo : 14}
      step={step !== undefined && Number.isInteger(Number(step)) ? Number(step) : undefined}
    />
  )
}
