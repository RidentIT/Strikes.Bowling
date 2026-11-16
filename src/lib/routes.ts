export const ROUTES = {
  home: '/',
  frontDesk: '/front-desk',
  onLane: '/on-lane',
  overhead: '/overhead',
  admin: '/admin',
  technician: '/technician',
  manager: '/manager',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
