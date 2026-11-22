'use client'

import { useId, useState } from 'react'
import { formatLaneNumber } from '../../lib/format'
import type { Lane } from '../../types/front-desk.types'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { INPUT_CLASSES } from '../ui/field-styles'

const MAX_NOTE_LENGTH = 120

interface MaintenanceDialogProps {
  lane: Lane
  onCancel: () => void
  onConfirm: (note: string) => void
}

/** Takes a lane out of service, with an optional reason shown on its card. */
export function MaintenanceDialog({ lane, onCancel, onConfirm }: MaintenanceDialogProps) {
  const [note, setNote] = useState('')
  const noteId = useId()
  const hintId = useId()

  return (
    <Dialog
      size="sm"
      title={`Mark Lane ${formatLaneNumber(lane.laneNumber)} under maintenance?`}
      description="The lane can't be assigned to games until it is returned to service."
      onClose={onCancel}
      footer={
        <>
          <Button onClick={onCancel}>Cancel</Button>
          <Button variant="primary" type="submit" form={`${noteId}-form`}>
            Mark under maintenance
          </Button>
        </>
      }
    >
      <form
        id={`${noteId}-form`}
        onSubmit={(event) => {
          event.preventDefault()
          onConfirm(note)
        }}
      >
        <label htmlFor={noteId} className="text-body-sm font-medium">
          Reason <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id={noteId}
          data-autofocus
          value={note}
          maxLength={MAX_NOTE_LENGTH}
          onChange={(event) => setNote(event.target.value)}
          aria-describedby={hintId}
          rows={3}
          placeholder="e.g. Ball return fault"
          className={`${INPUT_CLASSES} mt-1.5 resize-none py-2`}
        />
        <p id={hintId} className="mt-1 text-right text-caption text-muted tabular-nums">
          {note.length}/{MAX_NOTE_LENGTH}
        </p>
      </form>
    </Dialog>
  )
}
