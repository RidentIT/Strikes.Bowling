import type { Metadata } from 'next'
import { DESTINATIONS } from '@/data/destinations'
import { TechnicianPage } from '@/features/technician'

export const metadata: Metadata = { title: DESTINATIONS.technician.title }

export default TechnicianPage
