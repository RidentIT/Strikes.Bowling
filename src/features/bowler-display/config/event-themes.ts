import { Ban, CircleDot, Flag, Flame, PartyPopper, Sparkles, Trophy, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { BowlingEventType } from '../types/bowling-display.types'

export type BurstStyle = 'pins' | 'confetti' | 'sparks' | 'ball'

export interface EventTheme {
  title: string
  subtitle: string
  /** Gradient colours for the headline (CSS colour values). */
  from: string
  to: string
  icon: LucideIcon
  burst: BurstStyle
  durationMs: number
}

const rose = 'var(--color-brand-rose)'
const coral = 'var(--color-brand-coral)'
const violet = 'var(--color-brand-violet)'
const cyan = 'var(--color-brand-cyan)'
const blue = 'var(--color-brand-blue)'
const orange = 'var(--color-brand-orange)'
const yellow = '#ffd92e'

export const EVENT_THEMES: Record<BowlingEventType, EventTheme> = {
  strike: {
    title: 'STRIKE!',
    subtitle: 'All ten pins down',
    from: coral,
    to: rose,
    icon: Zap,
    burst: 'pins',
    durationMs: 2600,
  },
  spare: {
    title: 'SPARE!',
    subtitle: 'Picked up the rest',
    from: cyan,
    to: blue,
    icon: Sparkles,
    burst: 'confetti',
    durationMs: 2200,
  },
  double: {
    title: 'DOUBLE!',
    subtitle: 'Two strikes in a row',
    from: coral,
    to: violet,
    icon: Flame,
    burst: 'pins',
    durationMs: 2600,
  },
  turkey: {
    title: 'TURKEY!',
    subtitle: 'Three strikes in a row',
    from: yellow,
    to: orange,
    icon: Flame,
    burst: 'pins',
    durationMs: 3200,
  },
  split: {
    title: 'SPLIT',
    subtitle: 'A tough leave',
    from: violet,
    to: blue,
    icon: CircleDot,
    burst: 'sparks',
    durationMs: 2000,
  },
  'split-7-10': {
    title: '7–10 SPLIT',
    subtitle: 'The bed posts',
    from: violet,
    to: rose,
    icon: CircleDot,
    burst: 'sparks',
    durationMs: 2400,
  },
  gutter: {
    title: 'GUTTER BALL',
    subtitle: 'The ball took the scenic route',
    from: '#a1a1b5',
    to: cyan,
    icon: Ban,
    burst: 'ball',
    durationMs: 2400,
  },
  foul: {
    title: 'FOUL',
    subtitle: 'Line violation, no pins counted',
    from: orange,
    to: rose,
    icon: Flag,
    burst: 'sparks',
    durationMs: 2200,
  },
  'perfect-game': {
    title: 'PERFECT GAME',
    subtitle: '300. Twelve strikes in a row',
    from: yellow,
    to: rose,
    icon: Trophy,
    burst: 'confetti',
    durationMs: 5500,
  },
  'game-completed': {
    title: 'GAME COMPLETE',
    subtitle: 'Final results',
    from: coral,
    to: violet,
    icon: PartyPopper,
    burst: 'confetti',
    durationMs: 2600,
  },
}
