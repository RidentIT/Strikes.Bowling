'use client'

import type { ReactNode } from 'react'
import { useOptionalFrontDesk } from '../../context/FrontDeskProvider'

/**
 * Shows a placeholder until the prototype state has loaded in the browser.
 * Used inside each page (not the layout), so the layout always renders its
 * page segment and Next.js can validate instant navigation for it.
 */
export function FrontDeskGate({ children }: { children: ReactNode }) {
  if (useOptionalFrontDesk()) return children

  return (
    <div aria-busy="true" aria-label="Loading front desk" className="animate-pulse">
      <div className="h-4 w-40 rounded bg-surface-raised" />
      <div className="mt-3 h-8 w-64 rounded bg-surface-raised" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((key) => (
          <div key={key} className="h-28 rounded-xl border border-border bg-surface" />
        ))}
      </div>
      <div className="mt-6 h-80 rounded-xl border border-border bg-surface" />
    </div>
  )
}
