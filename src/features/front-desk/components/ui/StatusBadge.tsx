import { GAME_STATUS_STYLES, LANE_STATUS_STYLES, type StatusStyle } from '../../config/status-styles'
import type { GameStatus, LaneStatus } from '../../types/front-desk.types'

function StatusBadge({ style }: { style: StatusStyle }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-caption font-medium ${style.badge}`}
    >
      <span aria-hidden className={`size-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  )
}

export function LaneStatusBadge({ status }: { status: LaneStatus }) {
  return <StatusBadge style={LANE_STATUS_STYLES[status]} />
}

export function GameStatusBadge({ status }: { status: GameStatus }) {
  return <StatusBadge style={GAME_STATUS_STYLES[status]} />
}
