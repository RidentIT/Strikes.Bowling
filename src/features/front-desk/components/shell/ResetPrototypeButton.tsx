'use client'

import { useState } from 'react'
import { useOptionalFrontDesk } from '../../context/FrontDeskProvider'
import { useToast } from '../../context/ToastProvider'
import { ConfirmDialog } from '../ui/ConfirmDialog'

/** Restores the original mock data (prototype only). */
export function ResetPrototypeButton() {
  const frontDesk = useOptionalFrontDesk()
  const notify = useToast()
  const [confirming, setConfirming] = useState(false)

  return (
    <>
      <button
        type="button"
        disabled={!frontDesk}
        onClick={() => setConfirming(true)}
        className="mt-2 text-caption font-semibold text-secondary underline decoration-white/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-white/50 disabled:opacity-50"
      >
        Reset demo data
      </button>

      {confirming && frontDesk && (
        <ConfirmDialog
          title="Reset demo data?"
          description="All games, lanes and history go back to the original mock data. Games you created in this prototype are removed."
          confirmLabel="Reset data"
          tone="danger"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            frontDesk.actions.resetPrototype()
            setConfirming(false)
            notify({ tone: 'info', title: 'Demo data reset', description: 'The original mock data has been restored.' })
          }}
        />
      )}
    </>
  )
}
