import type { DisplayConfig } from '../types/display'

interface BowlerDisplayProps {
  config: DisplayConfig
}

/** Shared scoring UI for both On-Lane and Overhead screens. */
export function BowlerDisplay({ config }: BowlerDisplayProps) {
  const { label, lanes, showPlayerDetails } = config

  return (
    <div className="flex min-h-dvh flex-col bg-background p-8">
      <header className="flex items-center justify-between">
        <h1>{label}</h1>
        <p className="text-h3 text-brand-cyan">Lanes {lanes.join(' & ')}</p>
      </header>

      <div className="mt-8 grid flex-1 place-items-center rounded-xl border border-border bg-surface">
        <p className="text-muted">
          Scoreboard placeholder{showPlayerDetails && ' · player details enabled'}
        </p>
      </div>
    </div>
  )
}
