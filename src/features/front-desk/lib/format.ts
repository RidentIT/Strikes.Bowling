/**
 * Display formatting for the Front Desk. Only called in the browser after the
 * prototype state has loaded, so the user's own locale and clock are used.
 */

const MINUTE = 60_000

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' })
const dateFormat = new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
const longDateFormat = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export const formatTime = (iso: string) => timeFormat.format(new Date(iso))
export const formatDate = (iso: string) => dateFormat.format(new Date(iso))
export const formatLongDate = (date: Date) => longDateFormat.format(date)

/** "Lane 07" style number used throughout the alley. */
export const formatLaneNumber = (laneNumber: number) => String(laneNumber).padStart(2, '0')

/** 7 → "7m", 83 → "1h 23m". */
export function formatDuration(milliseconds: number): string {
  const totalMinutes = Math.max(0, Math.floor(milliseconds / MINUTE))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return hours > 0 ? `${hours}h ${String(minutes).padStart(2, '0')}m` : `${minutes}m`
}

export const durationBetween = (fromIso: string, to: Date | string) =>
  formatDuration(new Date(to).getTime() - new Date(fromIso).getTime())

/** "in 40m", "now", "15m late": for reservation start times. */
export function formatUntil(iso: string, now: Date): string {
  const minutes = Math.round((new Date(iso).getTime() - now.getTime()) / MINUTE)
  if (minutes > 0) return `in ${formatDuration(minutes * MINUTE)}`
  if (minutes === 0) return 'now'
  return `${formatDuration(-minutes * MINUTE)} late`
}

/** "5m ago", "2h 10m ago", or a date for anything older than a day. */
export function formatAgo(iso: string, now: Date): string {
  const elapsed = now.getTime() - new Date(iso).getTime()
  if (elapsed < MINUTE) return 'just now'
  if (elapsed < 24 * 60 * MINUTE) return `${formatDuration(elapsed)} ago`
  return `${formatDate(iso)}, ${formatTime(iso)}`
}

export const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`

/** Local calendar day as YYYY-MM-DD (the format of `<input type="date">`). */
export function toDateKey(date: Date | string): string {
  const value = new Date(date)
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${value.getFullYear()}-${month}-${day}`
}

/** Local time as HH:MM (the format of `<input type="time">`). */
export function toTimeInputValue(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

/** Combines an HH:MM value with the day of `reference`. Null for an empty or invalid value. */
export function fromTimeInputValue(value: string, reference: Date): Date | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return null
  const date = new Date(reference)
  date.setHours(hours, minutes, 0, 0)
  return date
}
