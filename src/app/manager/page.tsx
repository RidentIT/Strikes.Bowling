import type { Metadata } from 'next'
import { DESTINATIONS } from '@/data/destinations'
import { ManagerPage } from '@/features/manager'

export const metadata: Metadata = { title: DESTINATIONS.manager.title }

export default ManagerPage
