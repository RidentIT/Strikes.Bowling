'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { GameDetailsDialog } from '../components/game/GameDetailsDialog'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { useFrontDesk } from '../context/FrontDeskProvider'
import { useToast } from '../context/ToastProvider'
import { formatLaneNumber, pluralize } from '../lib/format'
import { selectGame } from '../state/front-desk-selectors'
import type { Game } from '../types/front-desk.types'

export interface GameActions {
  viewGame: (gameId: string) => void
  /** Asks for confirmation, then ends the game. */
  requestEndGame: (gameId: string) => void
  /** Asks for confirmation, then cancels the reservation. */
  requestCancelReservation: (gameId: string) => void
  checkIn: (gameId: string) => void
  /** Render once in the page: the details and confirmation dialogs. */
  dialogs: ReactNode
}

/**
 * The game actions shared by the Dashboard, Lane Management, Active Games and
 * Game History pages, so each behaves (and confirms) the same way everywhere.
 */
export function useGameActions(): GameActions {
  const { state, actions } = useFrontDesk()
  const notify = useToast()
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [endingId, setEndingId] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const laneLabel = (game: Game) => {
    const lane = state.lanes.find((candidate) => candidate.id === game.laneId)
    return lane ? `Lane ${formatLaneNumber(lane.laneNumber)}` : 'its lane'
  }

  const checkIn = (gameId: string) => {
    const result = actions.checkInReservation(gameId)
    if (!result.ok) {
      notify({ tone: 'error', title: 'Could not check in', description: result.error })
      return
    }
    setViewingId(null)
    notify({
      tone: 'success',
      title: `${result.value.gameNumber} checked in`,
      description: `${laneLabel(result.value)} is now occupied.`,
    })
  }

  const endGame = (game: Game) => {
    setEndingId(null)
    const result = actions.endGame(game.id)
    if (!result.ok) {
      notify({ tone: 'error', title: 'Could not end the game', description: result.error })
      return
    }
    notify({
      tone: 'success',
      title: `${game.gameNumber} completed`,
      description: `${laneLabel(game)} is available again. The game is in Game History.`,
    })
  }

  const cancelReservation = (game: Game) => {
    setCancellingId(null)
    const result = actions.cancelReservation(game.id)
    if (!result.ok) {
      notify({ tone: 'error', title: 'Could not cancel the reservation', description: result.error })
      return
    }
    notify({
      tone: 'success',
      title: `Reservation ${game.gameNumber} cancelled`,
      description: `${laneLabel(game)} is available again.`,
    })
  }

  const viewing = viewingId ? selectGame(state, viewingId) : undefined
  const ending = endingId ? state.activeGames.find((game) => game.id === endingId) : undefined
  const cancelling = cancellingId ? state.reservations.find((game) => game.id === cancellingId) : undefined

  const dialogs = (
    <>
      {viewing && !ending && !cancelling && (
        <GameDetailsDialog
          game={viewing}
          onClose={() => setViewingId(null)}
          onEndGame={() => {
            setViewingId(null)
            setEndingId(viewing.id)
          }}
          onCheckIn={() => checkIn(viewing.id)}
          onCancelReservation={() => {
            setViewingId(null)
            setCancellingId(viewing.id)
          }}
        />
      )}
      {ending && (
        <ConfirmDialog
          title={`End game ${ending.gameNumber}?`}
          description={
            <>
              {ending.groupName ? `${ending.groupName} · ` : ''}
              {pluralize(ending.players.length, 'player')} on {laneLabel(ending)}. The game moves to Game History
              and {laneLabel(ending)} becomes available.
            </>
          }
          confirmLabel="End game"
          cancelLabel="Keep playing"
          tone="danger"
          onCancel={() => setEndingId(null)}
          onConfirm={() => endGame(ending)}
        />
      )}
      {cancelling && (
        <ConfirmDialog
          title={`Cancel reservation ${cancelling.gameNumber}?`}
          description={
            <>
              {cancelling.groupName || 'This booking'} · {pluralize(cancelling.players.length, 'player')}.{' '}
              {laneLabel(cancelling)} will be released and become available.
            </>
          }
          confirmLabel="Cancel reservation"
          cancelLabel="Keep reservation"
          tone="danger"
          onCancel={() => setCancellingId(null)}
          onConfirm={() => cancelReservation(cancelling)}
        />
      )}
    </>
  )

  return {
    viewGame: setViewingId,
    requestEndGame: setEndingId,
    requestCancelReservation: setCancellingId,
    checkIn,
    dialogs,
  }
}
