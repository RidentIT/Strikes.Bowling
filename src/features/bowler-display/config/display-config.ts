import type { DisplayConfig, DisplayMode } from '../types/display'

export const DEFAULT_DISPLAY_CONFIGS: Record<DisplayMode, DisplayConfig> = {
  'on-lane': {
    mode: 'on-lane',
    label: 'On-Lane Display',
    lanes: [1],
    showPlayerDetails: true,
  },
  overhead: {
    mode: 'overhead',
    label: 'Overhead Display',
    lanes: [1, 2],
    showPlayerDetails: false,
  },
}
