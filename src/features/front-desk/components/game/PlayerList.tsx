import type { Player } from '../../types/front-desk.types'

interface PlayerNamesProps {
  players: Player[]
  /** Names shown before "+N more". */
  limit?: number
}

/** Compact, single-line list of player names for tables and cards. */
export function PlayerNames({ players, limit = 3 }: PlayerNamesProps) {
  const shown = players.slice(0, limit).map((player) => player.name)
  const hidden = players.length - shown.length
  return (
    <span className="text-caption text-muted" title={players.map((player) => player.name).join(', ')}>
      {shown.join(', ')}
      {hidden > 0 && ` +${hidden} more`}
    </span>
  )
}

/** Numbered list of every player, in bowling order. */
export function PlayerRoster({ players }: { players: Player[] }) {
  return (
    <ol className="grid gap-1.5 sm:grid-cols-2">
      {players.map((player, index) => (
        <li
          key={player.id}
          className="flex items-center gap-2.5 rounded-lg border border-border bg-background-raised px-3 py-2"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white/6 text-caption font-semibold text-secondary tabular-nums">
            {index + 1}
          </span>
          <span className="truncate text-body-sm">{player.name}</span>
        </li>
      ))}
    </ol>
  )
}
