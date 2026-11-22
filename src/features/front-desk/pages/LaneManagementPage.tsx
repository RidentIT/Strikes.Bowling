'use client'

import { LayoutGrid, Plus } from 'lucide-react'
import { useState } from 'react'
import { ROUTES } from '@/lib/routes'
import { LaneCard } from '../components/lanes/LaneCard'
import { MaintenanceDialog } from '../components/lanes/MaintenanceDialog'
import { FrontDeskGate } from '../components/shell/FrontDeskGate'
import { PageHeader } from '../components/shell/PageHeader'
import { LinkButton } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { LANE_STATUS_STYLES } from '../config/status-styles'
import { useFrontDesk } from '../context/FrontDeskProvider'
import { useToast } from '../context/ToastProvider'
import { useGameActions } from '../hooks/useGameActions'
import { formatLaneNumber, pluralize } from '../lib/format'
import { selectLaneCounts, selectLaneGame } from '../state/front-desk-selectors'
import { LANE_STATUSES, type Lane, type LaneStatus, type ManualLaneStatus } from '../types/front-desk.types'

type LaneFilter = LaneStatus | 'all'

const STATUS_TOASTS: Record<ManualLaneStatus, (label: string) => string> = {
  available: (label) => `${label} is available`,
  cleaning: (label) => `${label} marked for cleaning`,
  maintenance: (label) => `${label} is under maintenance`,
}

function LaneManagement() {
  const { state, now, actions } = useFrontDesk()
  const notify = useToast()
  const { viewGame, checkIn, requestCancelReservation, dialogs } = useGameActions()
  const [filter, setFilter] = useState<LaneFilter>('all')
  const [maintenanceLaneId, setMaintenanceLaneId] = useState<string | null>(null)

  const counts = selectLaneCounts(state)
  const lanes = filter === 'all' ? state.lanes : state.lanes.filter((lane) => lane.status === filter)
  const maintenanceLane = state.lanes.find((lane) => lane.id === maintenanceLaneId)

  const changeStatus = (lane: Lane, status: ManualLaneStatus, note = '') => {
    const label = `Lane ${formatLaneNumber(lane.laneNumber)}`
    const result = actions.setLaneStatus(lane.id, status, note)
    if (result.ok) notify({ tone: 'success', title: STATUS_TOASTS[status](label) })
    else notify({ tone: 'error', title: `Could not update ${label}`, description: result.error })
  }

  const filters: { value: LaneFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All lanes', count: state.lanes.length },
    ...LANE_STATUSES.map((status) => ({ value: status, label: LANE_STATUS_STYLES[status].label, count: counts[status] })),
  ]

  return (
    <>
      <PageHeader
        title="Lane Management"
        description="Monitor every lane, assign games to free lanes and keep lane statuses up to date."
        actions={
          <LinkButton href={ROUTES.frontDeskNewGame} variant="primary">
            <Plus aria-hidden />
            New game
          </LinkButton>
        }
      />

      <fieldset className="mb-5 flex flex-wrap gap-2">
        <legend className="sr-only">Filter lanes by status</legend>
        {filters.map((option) => {
          const selected = filter === option.value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              aria-label={`${option.label} (${option.count})`}
              onClick={() => setFilter(option.value)}
              className={`inline-flex h-8 items-center gap-2 rounded-lg border px-3 text-caption font-semibold transition-colors ${
                selected
                  ? 'border-white/20 bg-white/[0.08] text-foreground'
                  : 'border-border bg-surface text-secondary hover:text-foreground'
              }`}
            >
              {option.value !== 'all' && (
                <span aria-hidden className={`size-2 rounded-full ${LANE_STATUS_STYLES[option.value].dot}`} />
              )}
              {option.label}
              <span className="text-muted tabular-nums">{option.count}</span>
            </button>
          )
        })}
      </fieldset>

      {lanes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border">
          <EmptyState
            icon={LayoutGrid}
            title={`No ${filter === 'all' ? '' : `${LANE_STATUS_STYLES[filter].label.toLowerCase()} `}lanes`}
            description="Choose another status to see more lanes."
          />
        </div>
      ) : (
        <>
          <p className="sr-only" aria-live="polite">
            Showing {pluralize(lanes.length, 'lane')}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {lanes.map((lane) => (
              <LaneCard
                key={lane.id}
                lane={lane}
                game={selectLaneGame(state, lane)}
                now={now}
                onViewGame={viewGame}
                onCheckIn={checkIn}
                onCancelReservation={requestCancelReservation}
                onSetStatus={changeStatus}
                onRequestMaintenance={(target) => setMaintenanceLaneId(target.id)}
              />
            ))}
          </div>
        </>
      )}

      {maintenanceLane && (
        <MaintenanceDialog
          lane={maintenanceLane}
          onCancel={() => setMaintenanceLaneId(null)}
          onConfirm={(note) => {
            setMaintenanceLaneId(null)
            changeStatus(maintenanceLane, 'maintenance', note)
          }}
        />
      )}
      {dialogs}
    </>
  )
}

export function LaneManagementPage() {
  return (
    <FrontDeskGate>
      <LaneManagement />
    </FrontDeskGate>
  )
}
