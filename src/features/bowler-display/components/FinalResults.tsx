import { Trophy } from 'lucide-react'
import type { Player } from '../types/bowling-display.types'

interface RankedPlayer {
  player: Player
  rank: number
}

/** Orders by confirmed total score, highest first; equal scores share a rank. */
function rankPlayers(players: Player[]): RankedPlayer[] {
  const sorted = [...players].sort(
    (a, b) => b.totalScore - a.totalScore || a.number - b.number,
  )
  return sorted.map((player) => {
    const firstWithScore = sorted.findIndex((other) => other.totalScore === player.totalScore)
    return { player, rank: firstWithScore + 1 }
  })
}

interface FinalResultsProps {
  players: Player[]
}

/** Final rankings, shown once the game is completed. Fits up to 14 players without scrolling. */
export function FinalResults({ players }: FinalResultsProps) {
  const ranked = rankPlayers(players)
  const columns = ranked.length > 7 ? 2 : 1
  const rows = Math.ceil(ranked.length / columns)
  const winners = ranked.filter((entry) => entry.rank === 1)

  return (
    <section
      aria-label="Final results"
      className="u-gap-20 flex min-h-0 flex-1 flex-col"
    >
      <div className="u-h-150 u-px-40 u-rounded-18 u-gap-32 flex shrink-0 items-center border border-white/8 bg-linear-to-r from-brand-rose/25 via-surface-raised to-brand-violet/25">
        <Trophy aria-hidden className="u-h-88 u-w-88 shrink-0 text-brand-yellow" />
        <div className="min-w-0">
          <p className="u-text-18 font-bold tracking-[0.25em] text-brand-coral uppercase">
            Game complete
          </p>
          <p className="u-text-64 truncate font-black leading-tight tracking-tight">
            {winners.length === 1
              ? `${winners[0].player.name} wins!`
              : `${winners.map((entry) => entry.player.name).join(' & ')} win!`}
          </p>
        </div>
        <p className="u-text-104 ml-auto font-black leading-none tabular-nums text-gradient-brand">
          {winners[0]?.player.totalScore ?? 0}
        </p>
      </div>

      <ol
        className="u-gap-12 grid min-h-0 flex-1 auto-rows-fr content-start"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gridAutoFlow: 'column',
        }}
      >
        {ranked.map(({ player, rank }) => {
          const isWinner = rank === 1
          return (
            <li
              key={player.number}
              className={`u-px-28 u-gap-24 u-rounded-14 flex max-h-[calc(var(--u)*150)] min-h-0 items-center border ${
                isWinner
                  ? 'border-brand-yellow/50 bg-linear-to-r from-brand-yellow/18 to-surface'
                  : 'border-white/8 bg-surface'
              }`}
            >
              <span
                className={`u-text-48 u-w-72 shrink-0 text-center font-black tabular-nums ${
                  isWinner ? 'text-brand-yellow' : 'text-muted'
                }`}
              >
                {rank}
              </span>
              <span className="u-text-40 min-w-0 flex-1 truncate font-bold">{player.name}</span>
              {isWinner && (
                <span className="u-text-18 font-bold tracking-[0.2em] text-brand-yellow uppercase">
                  Winner
                </span>
              )}
              <span className="u-text-56 font-black tabular-nums">{player.totalScore}</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
