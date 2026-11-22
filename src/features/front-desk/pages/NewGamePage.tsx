'use client'

import { CircleAlert, CircleCheck, Clock3, Info, LayoutGrid, Minus, PlayCircle, Plus, Trash2, UserPlus } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { ROUTES } from '@/lib/routes'
import { PlayerRoster } from '../components/game/PlayerList'
import { FrontDeskGate } from '../components/shell/FrontDeskGate'
import { PageHeader } from '../components/shell/PageHeader'
import { Button, LinkButton } from '../components/ui/Button'
import { ERROR_TEXT_CLASSES, INPUT_CLASSES, LABEL_CLASSES } from '../components/ui/field-styles'
import { Panel } from '../components/ui/Panel'
import { LANE_STATUS_STYLES, SESSION_TYPE_LABELS } from '../config/status-styles'
import { useFrontDesk } from '../context/FrontDeskProvider'
import { useToast } from '../context/ToastProvider'
import { formatLaneNumber, formatTime, fromTimeInputValue, pluralize, toTimeInputValue } from '../lib/format'
import {
  MAX_GROUP_NAME_LENGTH,
  MAX_PLAYER_NAME_LENGTH,
  MAX_PLAYERS,
  MIN_PLAYERS,
  validateNewGame,
} from '../lib/new-game-validation'
import { selectAvailableLanes } from '../state/front-desk-selectors'
import { formatGameNumber } from '../state/front-desk-transitions'
import { SESSION_TYPES, type Game, type NewGameInput, type SessionType } from '../types/front-desk.types'

const DEFAULT_PLAYER_COUNT = 2

const SESSION_TYPE_HINTS: Record<SessionType, string> = {
  'walk-in': 'Group arrived without a booking.',
  reservation: 'Group booked in advance.',
}

/** Leaves the page the way staff came in, or goes to the dashboard. */
function useGoBack() {
  const router = useRouter()
  return () => {
    if (window.history.length > 1) router.back()
    else router.push(ROUTES.frontDesk)
  }
}

export function NewGamePage() {
  // The form reads ?lane= (preselected lane), which is only known in the browser.
  return (
    <FrontDeskGate>
      <Suspense fallback={null}>
        <NewGameFlow />
      </Suspense>
    </FrontDeskGate>
  )
}

function NewGameFlow() {
  const [created, setCreated] = useState<Game | null>(null)
  const [formKey, setFormKey] = useState(0)
  const router = useRouter()

  if (created) {
    return (
      <GameCreated
        game={created}
        onRegisterAnother={() => {
          setCreated(null)
          setFormKey((key) => key + 1)
        }}
      />
    )
  }

  return (
    <NewGameForm
      key={formKey}
      onCreated={(game) => {
        setCreated(game)
        // Drop a ?lane= preselection: that lane is now occupied.
        router.replace(ROUTES.frontDeskNewGame, { scroll: false })
        window.scrollTo({ top: 0 })
      }}
    />
  )
}

interface PlayerDraft {
  key: number
  name: string
}

interface FieldError {
  fieldId: string
  message: string
}

function Section({ step, title, description, children }: { step: number; title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface">
      <header className="flex items-start gap-3 border-b border-border px-5 py-4">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white/6 text-caption font-semibold text-secondary tabular-nums">
          {step}
        </span>
        <div>
          <h2 className="text-body font-semibold">{title}</h2>
          <p className="text-caption text-muted">{description}</p>
        </div>
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}

function FieldMessage({ id, message }: { id: string; message: string | undefined }) {
  if (!message) return null
  return (
    <p id={id} className={ERROR_TEXT_CLASSES}>
      <CircleAlert aria-hidden className="mt-px size-3.5 shrink-0" />
      {message}
    </p>
  )
}

function NewGameForm({ onCreated }: { onCreated: (game: Game) => void }) {
  const { state, now, actions } = useFrontDesk()
  const notify = useToast()
  const goBack = useGoBack()
  const searchParams = useSearchParams()

  const availableLanes = selectAvailableLanes(state)
  const requestedLaneId = searchParams.get('lane') ?? ''
  const requestedLane = state.lanes.find((lane) => lane.id === requestedLaneId)

  const [sessionType, setSessionType] = useState<SessionType>('walk-in')
  const [groupName, setGroupName] = useState('')
  const [players, setPlayers] = useState<PlayerDraft[]>(() =>
    Array.from({ length: DEFAULT_PLAYER_COUNT }, (_, key) => ({ key, name: '' })),
  )
  const nextPlayerKey = useRef(DEFAULT_PLAYER_COUNT)
  const [laneId, setLaneId] = useState(() => (requestedLane?.status === 'available' ? requestedLane.id : ''))
  const [startTime, setStartTime] = useState(() => toTimeInputValue(now))
  const [attempts, setAttempts] = useState(0)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const newPlayerRef = useRef<number | null>(null)

  const input: NewGameInput = {
    sessionType,
    groupName,
    playerNames: players.map((player) => player.name),
    laneId,
    startTime: fromTimeInputValue(startTime, now)?.toISOString() ?? '',
  }
  const errors = validateNewGame(input, state.lanes, now)
  const showErrors = attempts > 0
  const fieldErrors: FieldError[] = [
    errors.groupName && { fieldId: 'group-name', message: errors.groupName },
    errors.playerCount && { fieldId: 'player-count', message: errors.playerCount },
    ...players.map((player, index) => {
      const message = errors.players[index]
      return message ? { fieldId: `player-${player.key}`, message } : undefined
    }),
    errors.lane && { fieldId: 'lane-picker', message: errors.lane },
    errors.startTime && { fieldId: 'start-time', message: errors.startTime },
  ].filter((entry): entry is FieldError => Boolean(entry))

  // After a failed submit, move focus to the error summary so it is announced.
  useEffect(() => {
    if (attempts > 0) summaryRef.current?.focus()
  }, [attempts])

  // Focus the name field of a player that was just added.
  useEffect(() => {
    if (newPlayerRef.current === null) return
    document.getElementById(`player-${newPlayerRef.current}`)?.focus()
    newPlayerRef.current = null
  }, [players.length])

  const setPlayerCount = (count: number) => {
    const target = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, count))
    if (target <= players.length) {
      setPlayers(players.slice(0, target))
      return
    }
    const added = Array.from({ length: target - players.length }, (_, offset) => ({
      key: nextPlayerKey.current + offset,
      name: '',
    }))
    nextPlayerKey.current += added.length
    setPlayers([...players, ...added])
  }

  const addPlayer = () => {
    if (players.length >= MAX_PLAYERS) return
    newPlayerRef.current = nextPlayerKey.current
    setPlayerCount(players.length + 1)
  }

  const removePlayer = (key: number) => {
    setPlayers((current) => (current.length > MIN_PLAYERS ? current.filter((player) => player.key !== key) : current))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const submittedAt = new Date()
    const result = actions.createGame({
      ...input,
      startTime: fromTimeInputValue(startTime, submittedAt)?.toISOString() ?? '',
    })
    if (!result.ok) {
      setSubmitError(result.error)
      setAttempts((count) => count + 1)
      return
    }
    const lane = state.lanes.find((candidate) => candidate.id === result.value.laneId)
    notify({
      tone: 'success',
      title: `Game ${result.value.gameNumber} started`,
      description: lane ? `Lane ${formatLaneNumber(lane.laneNumber)} is now occupied.` : undefined,
    })
    onCreated(result.value)
  }

  const selectedLane = availableLanes.find((lane) => lane.id === laneId)
  const gameNumber = formatGameNumber(state.nextGameSequence)
  const namedPlayers = players.filter((player) => player.name.trim()).length

  return (
    <>
      <PageHeader
        title="New Game"
        description="Register a group, assign an available lane and start their game."
        actions={
          <Button onClick={goBack} variant="ghost">
            Cancel
          </Button>
        }
      />

      <form noValidate onSubmit={handleSubmit} className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          {showErrors && (fieldErrors.length > 0 || submitError) && (
            <div
              ref={summaryRef}
              tabIndex={-1}
              role="alert"
              className="rounded-xl border border-rose-500/40 bg-rose-500/[0.07] px-5 py-4"
            >
              <p className="flex items-center gap-2 text-body-sm font-semibold text-rose-200">
                <CircleAlert aria-hidden className="size-4" />
                {fieldErrors.length > 0
                  ? `Fix ${pluralize(fieldErrors.length, 'problem')} before starting the game`
                  : 'The game could not be started'}
              </p>
              <ul className="mt-2 space-y-1 pl-6 text-caption text-rose-200/90">
                {fieldErrors.length > 0
                  ? fieldErrors.map((error) => (
                      <li key={error.fieldId} className="list-disc">
                        <a href={`#${error.fieldId}`} className="underline decoration-rose-300/40 underline-offset-2 hover:decoration-rose-200">
                          {error.message}
                        </a>
                      </li>
                    ))
                  : <li className="list-disc">{submitError}</li>}
              </ul>
            </div>
          )}

          <Section step={1} title="Session" description="How the group arrived and what to call them.">
            <fieldset>
              <legend className={LABEL_CLASSES}>Session type</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {SESSION_TYPES.map((type) => (
                  <label
                    key={type}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background-raised px-4 py-3 transition-colors hover:border-white/15 has-checked:border-brand-rose/60 has-checked:bg-brand-rose/[0.06] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-coral"
                  >
                    <input
                      type="radio"
                      name="session-type"
                      value={type}
                      checked={sessionType === type}
                      onChange={() => setSessionType(type)}
                      className="mt-1 accent-brand-rose"
                    />
                    <span>
                      <span className="block text-body-sm font-semibold">{SESSION_TYPE_LABELS[type]}</span>
                      <span className="block text-caption text-muted">{SESSION_TYPE_HINTS[type]}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-5">
              <label htmlFor="group-name" className={LABEL_CLASSES}>
                Group or customer name <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="group-name"
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                maxLength={MAX_GROUP_NAME_LENGTH}
                autoComplete="off"
                placeholder={sessionType === 'reservation' ? 'Name on the booking' : 'e.g. Perera Family'}
                aria-invalid={showErrors && Boolean(errors.groupName)}
                aria-describedby={showErrors && errors.groupName ? 'group-name-error' : undefined}
                className={`${INPUT_CLASSES} mt-1.5 h-10 max-w-md`}
              />
              {showErrors && <FieldMessage id="group-name-error" message={errors.groupName} />}
            </div>
          </Section>

          <Section
            step={2}
            title="Players"
            description={`Between ${MIN_PLAYERS} and ${MAX_PLAYERS} players, in bowling order.`}
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <label htmlFor="player-count" className={LABEL_CLASSES}>
                  Number of players
                </label>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <Button
                    size="sm"
                    className="size-10 px-0"
                    onClick={() => setPlayerCount(players.length - 1)}
                    disabled={players.length <= MIN_PLAYERS}
                    aria-label="Remove the last player"
                  >
                    <Minus aria-hidden />
                  </Button>
                  <input
                    id="player-count"
                    type="number"
                    inputMode="numeric"
                    min={MIN_PLAYERS}
                    max={MAX_PLAYERS}
                    value={players.length}
                    onChange={(event) => {
                      const value = Number(event.target.value)
                      if (Number.isFinite(value) && event.target.value !== '') setPlayerCount(value)
                    }}
                    className={`${INPUT_CLASSES} h-10 w-16 text-center font-semibold tabular-nums`}
                  />
                  <Button
                    size="sm"
                    className="size-10 px-0"
                    onClick={addPlayer}
                    disabled={players.length >= MAX_PLAYERS}
                    aria-label="Add a player"
                  >
                    <Plus aria-hidden />
                  </Button>
                </div>
              </div>
              <p className="text-caption text-muted" aria-live="polite">
                {namedPlayers} of {pluralize(players.length, 'player')} named
                {players.length >= MAX_PLAYERS && ' · maximum reached'}
              </p>
            </div>
            {showErrors && <FieldMessage id="player-count-error" message={errors.playerCount} />}

            <ol className="mt-5 grid gap-x-4 gap-y-3 md:grid-cols-2">
              {players.map((player, index) => {
                const error = showErrors ? errors.players[index] : undefined
                const fieldId = `player-${player.key}`
                return (
                  <li key={player.key}>
                    <label htmlFor={fieldId} className="text-caption font-medium text-secondary">
                      Player {index + 1}
                    </label>
                    <div className="mt-1 flex gap-1.5">
                      <input
                        id={fieldId}
                        value={player.name}
                        onChange={(event) => {
                          const name = event.target.value
                          setPlayers((current) =>
                            current.map((candidate) => (candidate.key === player.key ? { ...candidate, name } : candidate)),
                          )
                        }}
                        maxLength={MAX_PLAYER_NAME_LENGTH}
                        autoComplete="off"
                        placeholder="Name"
                        aria-required="true"
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? `${fieldId}-error` : undefined}
                        className={`${INPUT_CLASSES} h-10`}
                      />
                      <Button
                        variant="ghost"
                        className="size-10 px-0"
                        onClick={() => removePlayer(player.key)}
                        disabled={players.length <= MIN_PLAYERS}
                        aria-label={`Remove player ${index + 1}${player.name.trim() ? ` (${player.name.trim()})` : ''}`}
                        title="Remove player"
                      >
                        <Trash2 aria-hidden />
                      </Button>
                    </div>
                    <FieldMessage id={`${fieldId}-error`} message={error} />
                  </li>
                )
              })}
            </ol>

            {players.length < MAX_PLAYERS && (
              <Button variant="ghost" size="sm" onClick={addPlayer} className="mt-4">
                <UserPlus aria-hidden />
                Add player
              </Button>
            )}
          </Section>

          <Section step={3} title="Lane and start time" description="Only lanes that are free right now can be selected.">
            {requestedLane && requestedLane.status !== 'available' && (
              <p className="mb-4 flex items-start gap-2 rounded-lg border border-amber-400/25 bg-amber-400/[0.06] px-3 py-2.5 text-caption text-amber-200">
                <Info aria-hidden className="mt-px size-3.5 shrink-0" />
                Lane {formatLaneNumber(requestedLane.laneNumber)} is {LANE_STATUS_STYLES[requestedLane.status].label.toLowerCase()}{' '}
                and can&apos;t take a new game. Choose an available lane.
              </p>
            )}

            <fieldset
              id="lane-picker"
              tabIndex={-1}
              aria-invalid={showErrors && Boolean(errors.lane)}
              aria-describedby={showErrors && errors.lane ? 'lane-error' : undefined}
            >
              <legend className={LABEL_CLASSES}>
                Lane{' '}
                <span className="font-normal text-muted">
                  · {pluralize(availableLanes.length, 'lane')} available
                </span>
              </legend>
              {availableLanes.length === 0 ? (
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-border px-4 py-4">
                  <p className="text-body-sm text-secondary">
                    No lanes are free. End a game or return a lane to service first.
                  </p>
                  <LinkButton href={ROUTES.frontDeskLanes} size="sm">
                    <LayoutGrid aria-hidden />
                    Lane management
                  </LinkButton>
                </div>
              ) : (
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                  {availableLanes.map((lane) => (
                    <label
                      key={lane.id}
                      className="flex cursor-pointer flex-col items-center rounded-lg border border-border bg-background-raised px-2 py-3 transition-colors hover:border-white/15 has-checked:border-brand-rose/70 has-checked:bg-brand-rose/[0.08] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-coral"
                    >
                      <input
                        type="radio"
                        name="lane"
                        value={lane.id}
                        checked={laneId === lane.id}
                        onChange={() => setLaneId(lane.id)}
                        className="sr-only"
                      />
                      <span className="text-caption text-muted">Lane</span>
                      <span className="text-h2 font-bold tabular-nums">{formatLaneNumber(lane.laneNumber)}</span>
                    </label>
                  ))}
                </div>
              )}
              {showErrors && <FieldMessage id="lane-error" message={errors.lane} />}
            </fieldset>

            <div className="mt-5">
              <label htmlFor="start-time" className={LABEL_CLASSES}>
                Start time
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  aria-invalid={showErrors && Boolean(errors.startTime)}
                  aria-describedby={`start-time-hint${showErrors && errors.startTime ? ' start-time-error' : ''}`}
                  className={`${INPUT_CLASSES} h-10 w-36 tabular-nums [color-scheme:dark]`}
                />
                <Button variant="ghost" size="sm" onClick={() => setStartTime(toTimeInputValue(new Date()))}>
                  <Clock3 aria-hidden />
                  Now
                </Button>
              </div>
              <p id="start-time-hint" className="mt-1.5 text-caption text-muted">
                Defaults to the current time. Adjust it if the group started a little earlier.
              </p>
              {showErrors && <FieldMessage id="start-time-error" message={errors.startTime} />}
            </div>
          </Section>
        </div>

        <aside className="xl:sticky xl:top-8">
          <Panel title="Summary">
            <dl className="space-y-3">
              <SummaryRow label="Game number">
                <span className="font-semibold tabular-nums">{gameNumber}</span>
              </SummaryRow>
              <SummaryRow label="Session">{SESSION_TYPE_LABELS[sessionType]}</SummaryRow>
              <SummaryRow label="Group">{groupName.trim() || <span className="text-muted">Not set</span>}</SummaryRow>
              <SummaryRow label="Players">{players.length}</SummaryRow>
              <SummaryRow label="Lane">
                {selectedLane ? `Lane ${formatLaneNumber(selectedLane.laneNumber)}` : <span className="text-muted">Not selected</span>}
              </SummaryRow>
              <SummaryRow label="Start">{startTime || <span className="text-muted">Not set</span>}</SummaryRow>
            </dl>
            <p className="mt-4 text-caption text-muted">
              The game number is assigned when the game starts. Billing is handled separately.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Button type="submit" variant="primary" disabled={availableLanes.length === 0}>
                <PlayCircle aria-hidden />
                Start game
              </Button>
              <Button onClick={goBack} variant="ghost">
                Cancel
              </Button>
            </div>
          </Panel>
        </aside>
      </form>
    </>
  )
}

function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-caption text-muted">{label}</dt>
      <dd className="truncate text-body-sm">{children}</dd>
    </div>
  )
}

function GameCreated({ game, onRegisterAnother }: { game: Game; onRegisterAnother: () => void }) {
  const { state } = useFrontDesk()
  const lane = state.lanes.find((candidate) => candidate.id === game.laneId)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <>
      <PageHeader title="New Game" />
      <section className="mx-auto max-w-2xl rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-6 py-6 text-center">
          <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-emerald-400/12 text-emerald-300">
            <CircleCheck aria-hidden className="size-5.5" />
          </span>
          <h2 ref={headingRef} tabIndex={-1} className="mt-4 text-h2 focus:outline-none">
            Game {game.gameNumber} has started
          </h2>
          <p className="mt-1 text-body-sm text-secondary">
            {lane ? `Lane ${formatLaneNumber(lane.laneNumber)}` : 'The lane'} is now occupied ·{' '}
            {pluralize(game.players.length, 'player')} · started {formatTime(game.startTime)}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-background-raised px-4 py-2">
            <span className="text-caption text-muted">Game number</span>
            <span className="text-h3 font-bold tabular-nums">{game.gameNumber}</span>
          </p>
        </div>
        <div className="px-6 py-5">
          <h3 className="mb-2.5 text-body-sm font-semibold">
            {game.groupName ? `${game.groupName} · ` : ''}Bowling order
          </h3>
          <PlayerRoster players={game.players} />
        </div>
        <div className="flex flex-wrap justify-center gap-2 border-t border-border px-6 py-4">
          <LinkButton href={ROUTES.frontDeskActiveGames} variant="primary">
            <PlayCircle aria-hidden />
            View active games
          </LinkButton>
          <LinkButton href={ROUTES.frontDeskLanes}>
            <LayoutGrid aria-hidden />
            Lane management
          </LinkButton>
          <Button variant="ghost" onClick={onRegisterAnother}>
            <Plus aria-hidden />
            Register another game
          </Button>
        </div>
      </section>
    </>
  )
}
