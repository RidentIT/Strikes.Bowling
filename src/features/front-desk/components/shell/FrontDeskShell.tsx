import Link from 'next/link'
import type { ReactNode } from 'react'
import { BackToHome } from '@/components/common/BackToHome'
import { StrikesLogo } from '@/components/common/StrikesLogo'
import { ROUTES } from '@/lib/routes'
import { FrontDeskProvider } from '../../context/FrontDeskProvider'
import { ToastProvider } from '../../context/ToastProvider'
import { FrontDeskNav } from './FrontDeskNav'
import { ResetPrototypeButton } from './ResetPrototypeButton'

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href={ROUTES.frontDesk} className="flex items-center gap-3 rounded-lg">
      <StrikesLogo className={compact ? 'h-9' : 'h-11'} sizes={compact ? '47px' : '58px'} />
      <span className="leading-tight">
        <span className="block text-body-sm font-extrabold tracking-[0.14em]">STRIKES</span>
        <span className="block text-caption text-muted">Front Desk</span>
      </span>
    </Link>
  )
}

/**
 * Front Desk application shell: persistent sidebar on desktop, a top bar with a
 * scrolling navigation row on smaller screens, and the shared state providers.
 */
export function FrontDeskShell({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <FrontDeskProvider>
        <a
          href="#front-desk-main"
          className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-body-sm font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>

        <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-background-raised lg:flex">
          <div className="px-5 pt-6 pb-5">
            <Brand />
          </div>
          <div className="flex-1 overflow-y-auto px-3">
            <p className="px-3 pb-2 text-eyebrow text-muted uppercase">Operations</p>
            <FrontDeskNav orientation="vertical" />
          </div>
          <div className="border-t border-border p-4">
            <div className="rounded-lg border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2.5">
              <p className="text-caption font-semibold text-amber-300">Prototype</p>
              <p className="mt-0.5 text-caption text-muted">Mock data, saved in this browser only.</p>
              <ResetPrototypeButton />
            </div>
          </div>
        </aside>

        <header className="sticky top-0 z-30 border-b border-border bg-background-raised/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4 px-4 pt-3 pb-2 sm:px-6">
            <Brand compact />
            <span className="rounded-md border border-amber-400/20 bg-amber-400/[0.06] px-2 py-1 text-caption font-semibold text-amber-300">
              Prototype
            </span>
          </div>
          <div className="px-2 sm:px-4">
            <FrontDeskNav orientation="horizontal" />
          </div>
        </header>

        <div className="lg:pl-64">
          <main id="front-desk-main" className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            <BackToHome className="mb-4" />
            {children}
          </main>
        </div>
      </FrontDeskProvider>
    </ToastProvider>
  )
}
