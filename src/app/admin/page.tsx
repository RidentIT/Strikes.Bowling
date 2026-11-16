import type { Metadata } from 'next'
import { DESTINATIONS } from '@/data/destinations'
import { AdminPage } from '@/features/admin'

export const metadata: Metadata = { title: DESTINATIONS.admin.title }

export default AdminPage
