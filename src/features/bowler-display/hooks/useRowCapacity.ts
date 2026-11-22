import { useEffect, useRef, useState } from 'react'
import { DESIGN_HEIGHT, DESIGN_WIDTH } from '../config/display-modes'

interface Metrics {
  /** Height of the rows area, in pixels. */
  areaHeight: number
  /** Pixels per design pixel (mirrors `--u` in the stylesheet). */
  unit: number
}

const FALLBACK_CAPACITY = 5

/**
 * Measures the player-rows area and works out how many rows of at least
 * `minRowHeight` (design pixels) fit, so the capacity follows the real screen
 * instead of a hard-coded number.
 */
export function useRowCapacity(minRowHeight: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [metrics, setMetrics] = useState<Metrics | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const measure = () => {
      const next: Metrics = {
        areaHeight: element.clientHeight,
        unit: Math.min(window.innerWidth / DESIGN_WIDTH, window.innerHeight / DESIGN_HEIGHT),
      }
      setMetrics((current) =>
        current && current.areaHeight === next.areaHeight && current.unit === next.unit
          ? current
          : next,
      )
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const capacity = metrics
    ? Math.max(1, Math.floor(metrics.areaHeight / (minRowHeight * metrics.unit)))
    : FALLBACK_CAPACITY

  return { ref, capacity, areaHeight: metrics?.areaHeight ?? 0, unit: metrics?.unit ?? 1 }
}
