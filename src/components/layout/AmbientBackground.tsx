interface AmbientBackgroundProps {
  /** `navy` for interface screens (default); `black` for the landing page. */
  tone?: 'navy' | 'black'
}

/** Fixed, decorative page backdrop (styles in globals.css). */
export function AmbientBackground({ tone = 'navy' }: AmbientBackgroundProps) {
  return <div aria-hidden data-tone={tone} className="ambient-backdrop" />
}
