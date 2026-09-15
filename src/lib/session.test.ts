import { describe, expect, it } from 'vitest'
import { roundHeadline, roundScoreLine, ROUND_SIZE } from './session.ts'

describe('roundHeadline', () => {
  it('invites a fresh sitting', () => {
    expect(
      roundHeadline({
        correct: 0,
        reviewed: 0,
        solidGained: 0,
        bestStreak: 0,
        complete: false,
      }),
    ).toMatch(/eight cards/i)
  })

  it('celebrates a clean round', () => {
    expect(
      roundHeadline({
        correct: ROUND_SIZE,
        reviewed: ROUND_SIZE,
        solidGained: 2,
        bestStreak: 8,
        complete: true,
      }),
    ).toBe('Clean round.')
  })

  it('names how many were locked in', () => {
    expect(
      roundHeadline({
        correct: 6,
        reviewed: 8,
        solidGained: 3,
        bestStreak: 4,
        complete: true,
      }),
    ).toBe('3 locked in.')
  })

  it('summarizes a paused sitting', () => {
    expect(
      roundHeadline({
        correct: 2,
        reviewed: 5,
        solidGained: 0,
        bestStreak: 2,
        complete: false,
      }),
    ).toBe('2 of 5 this sitting.')
  })
})

describe('roundScoreLine', () => {
  it('shows the score out of cards seen', () => {
    expect(
      roundScoreLine({
        correct: 5,
        reviewed: 8,
        solidGained: 1,
        bestStreak: 3,
        complete: true,
      }),
    ).toBe('5 of 8')
  })
})
