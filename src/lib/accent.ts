import type { CSSProperties } from 'react'
import type { AccentColor } from '@/types/theme'

/**
 * Exposes an accent colour as `--accent`, so children can use static
 * utilities like `text-(--accent)` or `bg-(--accent)/10`.
 */
export function accentStyle(accent: AccentColor): CSSProperties {
  return { '--accent': `var(--color-${accent})` } as CSSProperties
}
