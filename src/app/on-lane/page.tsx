import type { Metadata } from 'next'
import { BackToHome } from '@/components/common/BackToHome'
import { DESTINATIONS } from '@/data/destinations'
import { BowlerDisplayPage } from '@/features/bowler-display'

export const metadata: Metadata = { title: DESTINATIONS['on-lane'].title }

export default function OnLanePage(props: PageProps<'/on-lane'>) {
  return (
    <>
      <BowlerDisplayPage mode="on-lane" searchParams={props.searchParams} />
      <BackToHome variant="floating" />
    </>
  )
}
