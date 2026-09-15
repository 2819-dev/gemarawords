export const ROUND_SIZE = 8

export type RoundSummary = {
  correct: number
  reviewed: number
  solidGained: number
  bestStreak: number
  complete: boolean
}

export function emptyRound(): RoundSummary {
  return {
    correct: 0,
    reviewed: 0,
    solidGained: 0,
    bestStreak: 0,
    complete: false,
  }
}

export function roundHeadline(summary: RoundSummary): string {
  if (summary.reviewed === 0) {
    return 'Eight cards. English pshat. Go.'
  }
  if (summary.complete && summary.correct === summary.reviewed) {
    return 'Clean round.'
  }
  if (summary.complete && summary.correct === 0) {
    return 'The pshat will stick.'
  }
  if (summary.complete && summary.solidGained > 0) {
    return summary.solidGained === 1
      ? 'One more locked in.'
      : `${summary.solidGained} locked in.`
  }
  if (summary.complete) {
    return 'Round done.'
  }
  return `${summary.correct} of ${summary.reviewed} this sitting.`
}

export function roundScoreLine(summary: RoundSummary): string {
  if (summary.reviewed === 0) {
    return `A round is ${ROUND_SIZE} cards.`
  }
  return `${summary.correct} of ${summary.reviewed}`
}
