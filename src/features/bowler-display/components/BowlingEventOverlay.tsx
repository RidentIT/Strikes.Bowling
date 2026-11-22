'use client'

import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'
import { EVENT_THEMES } from '../config/event-themes'
import type { BurstStyle } from '../config/event-themes'
import type { BowlingEvent } from '../types/bowling-display.types'

const PARTICLE_COUNT = 14
const CONFETTI_COLOURS = [
  'var(--color-brand-rose)',
  'var(--color-brand-coral)',
  'var(--color-brand-violet)',
  'var(--color-brand-cyan)',
  '#ffd92e',
]

function Particle({ index, style }: { index: number; style: BurstStyle }) {
  // Deterministic spread so each burst looks the same and never depends on render timing.
  const angle = (index / PARTICLE_COUNT) * Math.PI * 2 + (index % 2) * 0.2
  const distance = 380 + (index % 4) * 70
  const x = Math.cos(angle) * distance
  const y = Math.sin(angle) * distance * 0.62
  const spin = (index % 2 === 0 ? 1 : -1) * (240 + index * 25)

  if (style === 'ball') return null

  return (
    <motion.span
      aria-hidden
      className="absolute top-1/2 left-1/2 block"
      initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
      animate={{ x, y: y + 90, opacity: 0, scale: 1, rotate: spin }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      {style === 'pins' ? (
        <svg viewBox="0 0 20 48" className="u-w-30 h-auto">
          <path
            d="M10 0c3 0 5 2 5 5 0 3-2 5-3 8-1 3 1 6 3 10 2 5 3 11 2 17-1 5-3 8-7 8s-6-3-7-8c-1-6 0-12 2-17 2-4 4-7 3-10-1-3-3-5-3-8 0-3 2-5 5-5z"
            fill="#f8fafc"
          />
          <rect x="4" y="12" width="12" height="3" fill="#f43f5e" />
          <rect x="3.5" y="17" width="13" height="3" fill="#f43f5e" />
        </svg>
      ) : style === 'confetti' ? (
        <span
          className="u-w-18 u-h-30 block rounded-[1px]"
          style={{ background: CONFETTI_COLOURS[index % CONFETTI_COLOURS.length] }}
        />
      ) : (
        <span
          className="u-w-14 u-h-14 block rounded-full"
          style={{ background: CONFETTI_COLOURS[index % CONFETTI_COLOURS.length] }}
        />
      )}
    </motion.span>
  )
}

interface BowlingEventOverlayProps {
  event: BowlingEvent | null
  /** Name of the player the event belongs to, when known. */
  playerName?: string
}

/**
 * Short celebration layer for scoring events. It renders only while an event is
 * active and ignores pointer input, so the scoreboard underneath is untouched.
 */
export function BowlingEventOverlay({ event, playerName }: BowlingEventOverlayProps) {
  return (
    <div aria-live="polite" className="pointer-events-none absolute inset-0 z-50">
      <AnimatePresence>
        {event && <EventContent key={event.id} event={event} playerName={playerName} />}
      </AnimatePresence>
    </div>
  )
}

function EventContent({ event, playerName }: { event: BowlingEvent; playerName?: string }) {
  const theme = EVENT_THEMES[event.type]
  const Icon = theme.icon
  const isGutter = theme.burst === 'ball'

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* A local vignette behind the headline; the rest of the scoreboard stays visible. */}
      <div
        aria-hidden
        className="u-w-1200 u-h-560 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(0_0_0/0.78),rgb(0_0_0/0.45)_65%,transparent)]"
      />

      {Array.from({ length: PARTICLE_COUNT }, (_, index) => (
        <Particle key={index} index={index} style={theme.burst} />
      ))}

      {isGutter && (
        <motion.span
          aria-hidden
          className="u-w-90 u-h-90 absolute top-1/2 left-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ff7a8d,#7a0f26_70%)]"
          initial={{ x: -260, y: -30, rotate: 0 }}
          animate={{ x: 760, y: 150, rotate: 720 }}
          transition={{ duration: 1.8, ease: 'easeIn' }}
        />
      )}

      <motion.div
        className="relative flex flex-col items-center text-center"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.08, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      >
        <Icon
          aria-hidden
          className="u-h-76 u-w-76"
          style={{ color: theme.from }}
          strokeWidth={1.5}
        />
        <p
          className="u-text-136 bg-clip-text pr-[0.1em] font-black leading-none tracking-tight text-transparent italic"
          style={{ backgroundImage: `linear-gradient(100deg, ${theme.from}, ${theme.to})` }}
        >
          {theme.title}
        </p>
        <p className="u-text-36 mt-2 font-bold text-foreground">{theme.subtitle}</p>
        {playerName && (
          <p className="u-text-26 mt-1 font-semibold tracking-[0.2em] text-secondary uppercase">
            {playerName}
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}
