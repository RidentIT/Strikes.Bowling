import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/lib/routes'

interface BackToHomeProps {
  /**
   * `inline`: a small text link in the page flow.
   * `floating`: a compact pill pinned to the top centre (the empty middle of
   * the display header, clear of the Next.js dev indicator in the bottom-left),
   * faded until hovered or focused, for full-screen displays.
   */
  variant?: 'inline' | 'floating'
  className?: string
}

/** Small link back to the STRIKES landing page, so every screen can be reached during a walkthrough. */
export function BackToHome({ variant = 'inline', className = '' }: BackToHomeProps) {
  if (variant === 'floating') {
    return (
      <Link
        href={ROUTES.home}
        aria-label="Back to STRIKES home"
        title="Back to STRIKES home"
        className={`fixed top-3 left-1/2 z-[60] inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-caption font-medium text-white/80 opacity-35 backdrop-blur-sm transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 ${className}`}
      >
        <ArrowLeft aria-hidden className="size-3.5" />
        Home
      </Link>
    )
  }

  return (
    <Link
      href={ROUTES.home}
      className={`inline-flex items-center gap-1.5 rounded-md text-caption font-medium text-muted transition-colors hover:text-foreground ${className}`}
    >
      <ArrowLeft aria-hidden className="size-3.5" />
      Back to STRIKES
    </Link>
  )
}
