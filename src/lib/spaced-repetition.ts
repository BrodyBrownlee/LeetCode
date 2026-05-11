import type { Confidence } from './db-types'

export type { Confidence }

const MIN_EASE = 1.3
const DEFAULT_EASE = 2.5

const BOOTSTRAP_INTERVALS: Record<Confidence, number> = {
  again: 1,
  hard: 1,
  good: 3,
  easy: 7,
}

export interface ScheduleResult {
  nextIntervalDays: number
  newEaseFactor: number
  nextReviewAt: Date
}

export function computeNextReview(
  confidence: Confidence,
  currentIntervalDays: number,
  easeFactor: number = DEFAULT_EASE,
): ScheduleResult {
  let newEaseFactor = easeFactor
  let nextIntervalDays: number

  if (currentIntervalDays === 0) {
    nextIntervalDays = BOOTSTRAP_INTERVALS[confidence]
    if (confidence === 'again') newEaseFactor = Math.max(MIN_EASE, easeFactor - 0.2)
    if (confidence === 'easy') newEaseFactor = easeFactor + 0.1
    return { nextIntervalDays, newEaseFactor, nextReviewAt: daysFromNow(nextIntervalDays) }
  }

  switch (confidence) {
    case 'again':
      nextIntervalDays = 1
      newEaseFactor = Math.max(MIN_EASE, easeFactor - 0.2)
      break
    case 'hard':
      nextIntervalDays = Math.max(1, Math.round(currentIntervalDays * 1.2))
      newEaseFactor = Math.max(MIN_EASE, easeFactor - 0.15)
      break
    case 'good':
      nextIntervalDays = Math.max(1, Math.round(currentIntervalDays * easeFactor))
      break
    case 'easy':
      nextIntervalDays = Math.max(1, Math.round(currentIntervalDays * easeFactor * 1.3))
      newEaseFactor = easeFactor + 0.1
      break
  }

  return { nextIntervalDays, newEaseFactor, nextReviewAt: daysFromNow(nextIntervalDays) }
}

export function isDueForReview(nextReviewAt: string | null): boolean {
  if (!nextReviewAt) return false
  return new Date(nextReviewAt) <= new Date()
}

function daysFromNow(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(0, 0, 0, 0)
  return date
}
