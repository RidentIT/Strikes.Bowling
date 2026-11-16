import Image from 'next/image'
import strikesLogo from '@/assets/logos/strikes-logo.png'

interface StrikesLogoProps {
  /** Size with a height utility (e.g. `h-24`); width follows the logo's aspect ratio. */
  className?: string
  /** Rendered widths per breakpoint, so Next.js serves an appropriately sized file. */
  sizes: string
}

export function StrikesLogo({ className = '', sizes }: StrikesLogoProps) {
  return (
    <Image
      src={strikesLogo}
      alt="STRIKES Bowling Centre"
      sizes={sizes}
      loading="eager"
      className={`w-auto max-w-full object-contain ${className}`}
    />
  )
}
