export type DisplayMode = 'on-lane' | 'overhead'

export interface DisplayConfig {
  mode: DisplayMode
  label: string
  /** Lanes this display instance shows. */
  lanes: number[]
  /** On-lane screens show player details; overhead screens show the scoreboard only. */
  showPlayerDetails: boolean
}
