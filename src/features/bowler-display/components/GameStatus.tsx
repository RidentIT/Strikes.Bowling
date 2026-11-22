import { CheckCheck, CircleCheck, Flag, Hourglass, UserRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ScoringStage } from '../types/bowling-display.types'

interface StageView {
  label: string
  icon: LucideIcon
  /** Tailwind text colour class. */
  tone: string
}

const STAGE_VIEWS: Record<ScoringStage, StageView> = {
  'awaiting-first-delivery': { label: 'Awaiting First Delivery', icon: Hourglass, tone: 'text-brand-cyan' },
  'first-delivery-completed': { label: 'First Delivery Completed', icon: CircleCheck, tone: 'text-brand-emerald' },
  'awaiting-second-delivery': { label: 'Awaiting Second Delivery', icon: Hourglass, tone: 'text-brand-cyan' },
  'second-delivery-completed': { label: 'Second Delivery Completed', icon: CircleCheck, tone: 'text-brand-emerald' },
  'awaiting-third-delivery': { label: 'Awaiting Third Delivery', icon: Hourglass, tone: 'text-brand-cyan' },
  'frame-completed': { label: 'Frame Completed', icon: CheckCheck, tone: 'text-brand-emerald' },
  'preparing-next-player': { label: 'Preparing Next Player', icon: UserRound, tone: 'text-brand-violet' },
  'game-completed': { label: 'Game Completed', icon: Flag, tone: 'text-brand-coral' },
}

interface GameStatusProps {
  stage: ScoringStage
}

/** The latest scoring state, exactly as reported by the game. */
export function GameStatus({ stage }: GameStatusProps) {
  const { label, icon: Icon, tone } = STAGE_VIEWS[stage]

  return (
    <div className="flex min-w-0 flex-col">
      <p className="u-text-16 font-semibold tracking-[0.2em] text-muted uppercase">Status</p>
      <p className={`u-text-30 u-gap-12 mt-1 flex items-center font-bold leading-tight ${tone}`}>
        <Icon aria-hidden className="size-[1.1em] shrink-0" />
        <span className="min-w-0">{label}</span>
      </p>
    </div>
  )
}
