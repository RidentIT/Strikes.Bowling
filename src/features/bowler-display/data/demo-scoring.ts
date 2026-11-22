/**
 * DEMO ONLY. Production scores come from the scoring backend as part of the
 * game state; the Bowler Display never calls this. It exists so the demo
 * timeline can produce realistic cumulative scores for its snapshots.
 */

const LAST_FRAME = 9

/** Cumulative score per frame from per-frame pin counts (confirmed deliveries only). null = not yet determinable. */
export function cumulativeScores(frames: number[][]): (number | null)[] {
  const rolls = frames.flat()
  const scores: (number | null)[] = []
  let index = 0
  let total = 0
  let blocked = false

  for (let f = 0; f <= LAST_FRAME; f++) {
    const frame = frames[f] ?? []
    let frameScore: number | null = null
    let consumed = frame.length

    if (f < LAST_FRAME) {
      if (frame[0] === 10) {
        consumed = 1
        if (rolls[index + 2] !== undefined) frameScore = 10 + rolls[index + 1] + rolls[index + 2]
      } else if (frame.length === 2) {
        if (frame[0] + frame[1] === 10) {
          if (rolls[index + 2] !== undefined) frameScore = 10 + rolls[index + 2]
        } else {
          frameScore = frame[0] + frame[1]
        }
      }
    } else {
      const done =
        frame.length === 3 || (frame.length === 2 && frame[0] !== 10 && frame[0] + frame[1] < 10)
      if (done) frameScore = frame.reduce((sum, pins) => sum + pins, 0)
    }

    index += consumed
    if (blocked || frameScore === null) {
      blocked = true
      scores.push(null)
    } else {
      total += frameScore
      scores.push(total)
    }
  }

  return scores
}

/** Whether a frame has all the deliveries it will get. */
export function isFrameComplete(frameIndex: number, pins: number[]): boolean {
  if (frameIndex < LAST_FRAME) return pins.length === 2 || (pins.length === 1 && pins[0] === 10)
  return pins.length === 3 || (pins.length === 2 && pins[0] !== 10 && pins[0] + pins[1] < 10)
}
