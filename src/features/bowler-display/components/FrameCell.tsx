import { frameMarks } from '../lib/frame-marks'
import type { Mark } from '../lib/frame-marks'
import type { Frame } from '../types/bowling-display.types'

export type FrameState = 'completed' | 'in-progress' | 'current' | 'upcoming'

const SYMBOL_TONES: Record<string, string> = {
  X: 'text-brand-coral',
  '/': 'text-brand-cyan',
  F: 'text-brand-orange',
  '-': 'text-muted',
}

function MarkBox({ mark }: { mark: Mark | null }) {
  // Unconfirmed results are dashed and amber so they never read as final.
  const tone = !mark
    ? ''
    : !mark.confirmed
      ? 'border-dashed border-brand-yellow/70 text-brand-yellow animate-pulse'
      : (SYMBOL_TONES[mark.symbol] ?? 'text-foreground')

  return (
    <span
      className={`u-w-42 u-h-48 u-text-32 flex items-center justify-center border border-white/12 font-extrabold tabular-nums ${tone}`}
    >
      {mark?.symbol}
    </span>
  )
}

interface FrameCellProps {
  frame: Frame
  state: FrameState
}

/** One frame: delivery marks on top, confirmed running score below. */
export function FrameCell({ frame, state }: FrameCellProps) {
  const marks = frameMarks(frame)

  const surface =
    state === 'current'
      ? 'bg-brand-rose/18 shadow-[inset_0_0_0_2px_rgb(244_63_94/0.7)]'
      : state === 'upcoming'
        ? 'opacity-40'
        : ''

  return (
    <div
      className={`relative flex min-w-0 flex-col border-l border-white/10 ${surface}`}
      aria-label={`Frame ${frame.number}`}
    >
      <div className="flex justify-end">
        {marks.map((mark, index) => (
          <MarkBox key={index} mark={mark} />
        ))}
      </div>
      <p className="u-text-52 flex flex-1 items-center justify-center font-extrabold tabular-nums">
        {frame.score ?? (frame.deliveries.length > 0 ? <span className="text-muted">·</span> : null)}
      </p>
    </div>
  )
}
