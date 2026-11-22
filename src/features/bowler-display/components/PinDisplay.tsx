import type { PinDetection, PinDetectionStatus } from '../types/bowling-display.types'

/** Pin numbers per row of the ten-pin triangle, back row first (head pin at the front). */
const PIN_ROWS: number[][] = [
  [7, 8, 9, 10],
  [4, 5, 6],
  [2, 3],
  [1],
]

const PIN_SPACING = 27
const ROW_SPACING = 25

const STATUS_LABELS: Record<PinDetectionStatus, string> = {
  detected: 'Detected',
  pending: 'Awaiting rack',
  unavailable: 'Unavailable',
}

interface PinDisplayProps {
  pins: PinDetection | null
}

/** Compact ten-pin formation fed by T-Vision pin detection. */
export function PinDisplay({ pins }: PinDisplayProps) {
  const status: PinDetectionStatus = pins?.status ?? 'unavailable'
  const standingCount = pins ? pins.standing.filter(Boolean).length : null

  return (
    <div className="flex h-full items-center u-gap-16">
      <svg
        viewBox="0 0 120 100"
        role="img"
        aria-label={
          pins ? `${standingCount} pins standing` : 'Pin detection unavailable'
        }
        className="h-full w-auto shrink-0"
      >
        {PIN_ROWS.map((row, rowIndex) =>
          row.map((pinNumber, index) => {
            const x = 60 + (index - (row.length - 1) / 2) * PIN_SPACING
            const y = 14 + rowIndex * ROW_SPACING
            const isStanding = pins ? pins.standing[pinNumber - 1] : false

            return isStanding ? (
              <g key={pinNumber}>
                <circle cx={x} cy={y} r="10.5" fill="#f8fafc" />
                <circle cx={x - 2.5} cy={y - 3} r="3.5" fill="#ffffff" opacity="0.7" />
                <circle cx={x} cy={y} r="10.5" fill="none" stroke="#f43f5e" strokeWidth="2" opacity="0.9" />
              </g>
            ) : (
              <circle
                key={pinNumber}
                cx={x}
                cy={y}
                r="7"
                fill="none"
                stroke="#737b94"
                strokeOpacity={pins ? 0.5 : 0.25}
                strokeDasharray="3 3"
              />
            )
          }),
        )}
      </svg>

      <div className="flex min-w-0 flex-col">
        <p className="u-text-16 font-semibold tracking-[0.2em] text-muted uppercase">T-Vision</p>
        <p
          className={`u-text-22 font-bold ${
            status === 'detected' ? 'text-brand-emerald' : 'text-secondary'
          }`}
        >
          {STATUS_LABELS[status]}
        </p>
        <p className="u-text-18 text-secondary tabular-nums">
          {standingCount === null ? 'No pin data' : `${standingCount} standing`}
        </p>
      </div>
    </div>
  )
}
