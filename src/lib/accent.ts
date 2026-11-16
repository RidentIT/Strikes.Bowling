import type { CSSProperties } from 'react'
import type { Accent } from '@/types/theme'

/**
 * Exposes an accent as `--accent` and `--accent-to`, so children can use static
 * utilities like `text-(--accent)` or `from-(--accent) to-(--accent-to)`.
 */
export function accentStyle({ from, to }: Accent): CSSProperties {
  return {
    '--accent': `var(--color-${from})`,
    '--accent-to': `var(--color-${to})`,
  } as CSSProperties
}
