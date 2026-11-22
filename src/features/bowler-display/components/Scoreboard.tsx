'use client'

import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'
import type { CSSProperties } from 'react'
import { DISPLAY_MODE_SETTINGS } from '../config/display-modes'
import { usePlayerPaging } from '../hooks/usePlayerPaging'
import { useRowCapacity } from '../hooks/useRowCapacity'
import { FRAME_COUNT } from '../types/bowling-display.types'
import type { DisplayMode, GameState } from '../types/bowling-display.types'
import { PlayerScoreRow } from './PlayerScoreRow'

/** Name column, nine frames, a wider tenth frame, then the total. */
const SCORE_COLUMNS = 'minmax(0,3.4fr) repeat(9,minmax(0,1.1fr)) minmax(0,1.8fr) minmax(0,1.5fr)'

const FRAME_NUMBERS = Array.from({ length: FRAME_COUNT }, (_, index) => index + 1)

interface ScoreboardProps {
  game: GameState
  displayMode: DisplayMode
}

/**
 * The main scoring grid. The header row is fixed; only the player rows change,
 * and which group of players is shown follows the active player automatically.
 */
export function Scoreboard({ game, displayMode }: ScoreboardProps) {
  const { minRowHeight, maxRowHeight } = DISPLAY_MODE_SETTINGS[displayMode]
  const { ref, capacity, areaHeight, unit } = useRowCapacity(minRowHeight)
  const page = usePlayerPaging({
    players: game.players,
    activePlayerNumber: game.activePlayerNumber,
    capacity,
  })

  // Rows fill the available height; a shorter last group simply gets slightly taller rows.
  const rowHeight = Math.floor(
    Math.min(areaHeight / Math.max(1, page.visiblePlayers.length), maxRowHeight * unit),
  )

  return (
    <section
      aria-label="Scoreboard"
      style={{ '--score-cols': SCORE_COLUMNS } as CSSProperties}
      className="u-rounded-18 flex min-h-0 flex-1 flex-col overflow-hidden border border-white/8 bg-surface/80"
    >
      <div className="u-h-56 grid shrink-0 grid-cols-(--score-cols) items-center border-b border-white/15 bg-surface-raised">
        <p className="u-px-24 u-text-16 font-bold tracking-[0.16em] whitespace-nowrap text-secondary uppercase">
          {page.pageCount > 1
            ? `Players ${page.firstNumber}–${page.lastNumber} / ${game.players.length}`
            : 'Players'}
        </p>
        {FRAME_NUMBERS.map((number) => (
          <p
            key={number}
            className={`u-text-24 text-center font-extrabold ${
              number === game.currentFrame ? 'text-brand-coral' : 'text-secondary'
            }`}
          >
            {number}
          </p>
        ))}
        <p className="u-text-18 text-center font-bold tracking-[0.2em] text-secondary uppercase">
          Total
        </p>
      </div>

      <div ref={ref} className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page.pageIndex}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute inset-x-0 top-0 flex flex-col"
          >
            {areaHeight > 0 &&
              page.visiblePlayers.map((player) => (
                <PlayerScoreRow
                  key={player.number}
                  player={player}
                  isActive={player.number === game.activePlayerNumber}
                  currentFrame={game.currentFrame}
                  height={rowHeight}
                />
              ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
