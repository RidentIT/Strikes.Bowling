import type { Metadata } from 'next'
import { DESTINATIONS } from '@/data/destinations'
import { BowlerDisplayPage } from '@/features/bowler-display'

export const metadata: Metadata = { title: DESTINATIONS.overhead.title }

export default function OverheadPage(props: PageProps<'/overhead'>) {
  return <BowlerDisplayPage mode="overhead" searchParams={props.searchParams} />
}
