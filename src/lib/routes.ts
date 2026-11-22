export const ROUTES = {
  home: '/',
  frontDesk: '/front-desk',
  frontDeskLanes: '/front-desk/lanes',
  frontDeskNewGame: '/front-desk/new-game',
  frontDeskActiveGames: '/front-desk/active-games',
  frontDeskHistory: '/front-desk/history',
  onLane: '/on-lane',
  overhead: '/overhead',
  admin: '/admin',
  technician: '/technician',
  manager: '/manager',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
