import { BowlerDisplay } from '../components/BowlerDisplay'
import { useDisplayConfig } from '../hooks/useDisplayConfig'
import type { DisplayMode } from '../types/display'

interface BowlerDisplayPageProps {
  mode: DisplayMode
}

export function BowlerDisplayPage({ mode }: BowlerDisplayPageProps) {
  const config = useDisplayConfig(mode)
  return <BowlerDisplay config={config} />
}
