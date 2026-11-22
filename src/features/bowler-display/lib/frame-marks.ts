import type { Frame } from '../types/bowling-display.types'

export interface Mark {
  /** X strike, / spare, - zero, F foul, or the pin count. */
  symbol: string
  confirmed: boolean
}

/**
 * Presentation of a frame's deliveries in standard notation, one entry per
 * delivery box (two boxes, or three in the tenth frame). Empty boxes are null.
 * This only formats results supplied by the game state; it does not score.
 */
export function frameMarks(frame: Frame): (Mark | null)[] {
  const isTenth = frame.number === 10
  const boxCount = isTenth ? 3 : 2
  const marks: Mark[] = []
  let standing = 10

  for (const delivery of frame.deliveries) {
    let symbol: string
    if (delivery.foul) symbol = 'F'
    else if (delivery.pins === standing) symbol = standing === 10 ? 'X' : '/'
    else symbol = delivery.pins === 0 ? '-' : String(delivery.pins)

    marks.push({ symbol, confirmed: delivery.confirmed })
    if (!delivery.foul) standing = delivery.pins === standing ? 10 : standing - delivery.pins
  }

  // A first-ball strike sits in the second box, as on a paper scoresheet.
  const boxes: (Mark | null)[] =
    !isTenth && marks[0]?.symbol === 'X' ? [null, marks[0]] : [...marks]

  while (boxes.length < boxCount) boxes.push(null)
  return boxes
}
