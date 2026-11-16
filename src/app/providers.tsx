'use client'

import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  // Honour the OS "reduce motion" setting for every animation.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
