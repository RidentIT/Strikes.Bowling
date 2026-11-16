import { Suspense } from 'react'
import { BowlerDisplay } from '../components/BowlerDisplay'
import { resolveDisplayConfig } from '../config/resolve-display-config'
import type { DisplayMode } from '../types/display'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

interface BowlerDisplayPageProps {
  mode: DisplayMode
  searchParams: SearchParams
}

export function BowlerDisplayPage({ mode, searchParams }: BowlerDisplayPageProps) {
  // Search params are request-time data, so they're read inside a Suspense boundary.
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background" />}>
      <ConfiguredBowlerDisplay mode={mode} searchParams={searchParams} />
    </Suspense>
  )
}

async function ConfiguredBowlerDisplay({ mode, searchParams }: BowlerDisplayPageProps) {
  const { lanes } = await searchParams
  return <BowlerDisplay config={resolveDisplayConfig(mode, lanes)} />
}
