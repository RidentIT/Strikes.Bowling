import type { DisplayConfig, DisplayMode } from '../types/display'
import { DEFAULT_DISPLAY_CONFIGS } from './display-config'

function parseLanes(value: string | string[] | undefined): number[] {
  if (!value) return []
  return [value]
    .flat()
    .flatMap((part) => part.split(','))
    .map((part) => Number(part.trim()))
    .filter((lane) => Number.isInteger(lane) && lane > 0)
}

/**
 * Resolves the config for one physical display instance: the mode's defaults,
 * overridden by URL params so each screen can be pointed at its own lanes,
 * e.g. `/overhead?lanes=5,6`.
 */
export function resolveDisplayConfig(
  mode: DisplayMode,
  lanesParam: string | string[] | undefined,
): DisplayConfig {
  const defaults = DEFAULT_DISPLAY_CONFIGS[mode]
  const lanes = parseLanes(lanesParam)
  return lanes.length > 0 ? { ...defaults, lanes } : defaults
}
