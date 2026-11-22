import type { DisplayMode } from '../types/bowling-display.types'

/** Presentation-only differences between the two displays. Both render the same game state. */
export interface DisplayModeSettings {
  label: string
  /** Multiplier applied to text sizes. */
  typeScale: number
  /** Smallest readable player-row height, in design pixels (1920 x 1200 reference). */
  minRowHeight: number
  /** Rows never grow taller than this, in design pixels. */
  maxRowHeight: number
}

export const DISPLAY_MODE_SETTINGS: Record<DisplayMode, DisplayModeSettings> = {
  'on-lane': { label: 'On-Lane Display', typeScale: 1, minRowHeight: 150, maxRowHeight: 250 },
  overhead: { label: 'Overhead Display', typeScale: 1.12, minRowHeight: 160, maxRowHeight: 250 },
}

/** Reference resolution the design units are based on. */
export const DESIGN_WIDTH = 1920
export const DESIGN_HEIGHT = 1200
