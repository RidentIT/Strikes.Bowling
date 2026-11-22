import { FrameCell } from './FrameCell'
import type { FrameState } from './FrameCell'
import type { Player } from '../types/bowling-display.types'

interface PlayerScoreRowProps {
  player: Player
  isActive: boolean
  currentFrame: number
  /** Row height in pixels. */
  height: number
}

function frameState(player: Player, frameIndex: number, isActive: boolean, currentFrame: number): FrameState {
  const frame = player.frames[frameIndex]
  if (isActive && frame.number === currentFrame) return 'current'
  if (frame.isComplete) return 'completed'
  return frame.deliveries.length > 0 ? 'in-progress' : 'upcoming'
}

/** One player: name, ten frames and the running total. The active player is highlighted. */
export function PlayerScoreRow({ player, isActive, currentFrame, height }: PlayerScoreRowProps) {
  return (
    <div
      style={{ height }}
      aria-current={isActive ? 'true' : undefined}
      className={`relative grid shrink-0 grid-cols-(--score-cols) border-b border-white/8 ${
        isActive ? 'bg-linear-to-r from-brand-rose/22 via-brand-rose/6 to-transparent' : ''
      }`}
    >
      {isActive && (
        <div aria-hidden className="absolute inset-y-0 left-0 w-[0.45%] bg-brand-rose" />
      )}

      <div className="u-px-20 u-gap-14 flex min-w-0 items-center">
        <span
          className={`u-text-26 u-w-46 u-h-46 u-rounded-10 flex shrink-0 items-center justify-center font-extrabold tabular-nums ${
            isActive ? 'bg-brand-rose text-white' : 'bg-white/8 text-secondary'
          }`}
        >
          {player.number}
        </span>
        <div className="flex min-w-0 flex-col">
          <p className={`u-text-34 truncate font-bold leading-tight ${isActive ? '' : 'text-foreground/90'}`}>
            {player.name}
          </p>
          {isActive && (
            <p className="u-text-16 font-bold tracking-[0.2em] text-brand-coral uppercase">
              Now bowling
            </p>
          )}
        </div>
      </div>

      {player.frames.map((frame, index) => (
        <FrameCell
          key={frame.number}
          frame={frame}
          state={frameState(player, index, isActive, currentFrame)}
        />
      ))}

      <div className="flex items-center justify-center border-l border-white/10 bg-white/4">
        <span className="u-text-64 font-black tabular-nums">{player.totalScore}</span>
      </div>
    </div>
  )
}
