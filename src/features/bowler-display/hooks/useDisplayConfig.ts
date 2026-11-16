import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DEFAULT_DISPLAY_CONFIGS } from '../config/display-config'
import type { DisplayConfig, DisplayMode } from '../types/display'

function parseLanes(value: string | null): number[] {
  if (!value) return []
  return value
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((lane) => Number.isInteger(lane) && lane > 0)
}

/**
 * Resolves the config for one physical display instance: the mode's defaults,
 * overridden by URL params so each screen can be pointed at its own lanes,
 * e.g. `/overhead?lanes=5,6`.
 */
export function useDisplayConfig(mode: DisplayMode): DisplayConfig {
  const [searchParams] = useSearchParams()
  const lanesParam = searchParams.get('lanes')

  return useMemo(() => {
    const defaults = DEFAULT_DISPLAY_CONFIGS[mode]
    const lanes = parseLanes(lanesParam)
    return lanes.length > 0 ? { ...defaults, lanes } : defaults
  }, [mode, lanesParam])
}
