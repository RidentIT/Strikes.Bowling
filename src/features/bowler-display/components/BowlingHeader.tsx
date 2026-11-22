import Image from 'next/image'
import strikesLogo from '@/assets/logos/strikes-logo.png'

interface BowlingHeaderProps {
  gameId: string
  laneId: string
}

function Divider() {
  return <span aria-hidden className="h-[55%] w-px bg-white/15" />
}

/** Compact top bar: STRIKES | LIVE SCOREBOARD | GAME 1025 | LANE 07. */
export function BowlingHeader({ gameId, laneId }: BowlingHeaderProps) {
  return (
    <header className="u-h-64 u-gap-24 flex shrink-0 items-center">
      <Image
        src={strikesLogo}
        alt="STRIKES"
        sizes="80px"
        loading="eager"
        className="u-h-60 w-auto object-contain"
      />
      <Divider />
      <p className="u-text-24 u-gap-12 flex items-center font-bold tracking-[0.18em] uppercase">
        <span className="relative flex size-[0.6em]">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-rose opacity-70" />
          <span className="relative inline-flex size-full rounded-full bg-brand-rose" />
        </span>
        Live Scoreboard
      </p>
      <div className="flex-1" />
      <p className="u-text-24 u-gap-24 flex items-center font-semibold tracking-[0.16em] text-secondary uppercase">
        <span>
          Game <span className="text-foreground tabular-nums">{gameId}</span>
        </span>
        <Divider />
        <span>
          Lane <span className="text-foreground tabular-nums">{laneId}</span>
        </span>
      </p>
    </header>
  )
}
