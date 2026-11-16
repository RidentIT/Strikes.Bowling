import type { Metadata } from 'next'
import { DESTINATIONS } from '@/data/destinations'
import { FrontDeskPage } from '@/features/front-desk'

export const metadata: Metadata = { title: DESTINATIONS['front-desk'].title }

export default FrontDeskPage
