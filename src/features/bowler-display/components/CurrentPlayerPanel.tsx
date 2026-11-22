import { FRAME_COUNT } from '../types/bowling-display.types'
import type { GameState, Player } from '../types/bowling-display.types'
import { GameStatus } from './GameStatus'
import { PinDisplay } from './PinDisplay'

interface CurrentPlayerPanelProps {
  game: GameState
  activePlayer: Player | undefined
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col">
      <p className="u-text-16 font-semibold tracking-[0.2em] text-muted uppercase">{label}</p>
      {children}
    </div>
  )
}

/** Who is bowling, which frame, the confirmed score, the latest state and the pins. */
export function CurrentPlayerPanel({ game, activePlayer }: CurrentPlayerPanelProps) {
  return (
    <section
      aria-label="Current game information"
      className="u-h-172 u-px-32 u-gap-40 u-rounded-18 relative grid shrink-0 grid-cols-[minmax(0,1.7fr)_auto_auto_minmax(0,1.5fr)_auto] items-center overflow-hidden border border-white/8 bg-linear-to-r from-surface-raised to-surface"
    >
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-[0.5%] bg-linear-to-b from-brand-rose to-brand-violet"
      />

      <Stat label={`Now bowling · Player ${String(activePlayer?.number ?? 0).padStart(2, '0')}`}>
        <p className="u-text-64 truncate font-extrabold leading-tight tracking-tight">
          {activePlayer?.name ?? '—'}
        </p>
      </Stat>

      <Stat label="Frame">
        <p className="flex items-baseline gap-[0.15em] leading-none">
          <span className="u-text-104 text-gradient-brand font-black tabular-nums">
            {game.currentFrame}
          </span>
          <span className="u-text-30 font-bold text-muted">/ {FRAME_COUNT}</span>
        </p>
      </Stat>

      <Stat label="Confirmed score">
        <p className="u-text-104 font-black leading-none tabular-nums">
          {activePlayer?.totalScore ?? 0}
        </p>
      </Stat>

      <GameStatus stage={game.stage} />

      <div className="u-h-132">
        <PinDisplay pins={game.pins} />
      </div>
    </section>
  )
}
