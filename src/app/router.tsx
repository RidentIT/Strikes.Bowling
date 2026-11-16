import { createBrowserRouter } from 'react-router-dom'
import { AdminPage } from '@/features/admin'
import { BowlerDisplayPage } from '@/features/bowler-display'
import { FrontDeskPage } from '@/features/front-desk'
import { ManagerPage } from '@/features/manager'
import { TechnicianPage } from '@/features/technician'
import { ROUTES } from '@/lib/routes'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  { path: ROUTES.home, element: <HomePage /> },
  { path: ROUTES.frontDesk, element: <FrontDeskPage /> },
  // On-Lane and Overhead share one feature, configured per route.
  { path: ROUTES.onLane, element: <BowlerDisplayPage mode="on-lane" /> },
  { path: ROUTES.overhead, element: <BowlerDisplayPage mode="overhead" /> },
  { path: ROUTES.admin, element: <AdminPage /> },
  { path: ROUTES.technician, element: <TechnicianPage /> },
  { path: ROUTES.manager, element: <ManagerPage /> },
  { path: '*', element: <NotFoundPage /> },
])
