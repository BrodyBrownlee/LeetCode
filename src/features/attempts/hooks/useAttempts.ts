import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import { computeNextReview } from '../../../lib/spaced-repetition'
import type { Confidence } from '../../../lib/db-types'

interface SubmitReviewInput {
  problemId: string
  currentIntervalDays: number
  easeFactor: number
  confidence: Confidence
  time_spent_minutes?: number
  notes?: string
  solution_code?: string
  solution_language?: string
}

export function useSubmitReview() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: SubmitReviewInput) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const schedule = computeNextReview(
        input.confidence,
        input.currentIntervalDays,
        input.easeFactor,
      )

      await supabase.from('problems').update({
        ease_factor: schedule.newEaseFactor,
        current_interval_days: schedule.nextIntervalDays,
        next_review_at: schedule.nextReviewAt.toISOString(),
      }).eq('id', input.problemId)

      const { error } = await supabase.from('attempts').insert({
        problem_id: input.problemId,
        user_id: user.id,
        confidence: input.confidence,
        time_spent_minutes: input.time_spent_minutes ?? null,
        notes: input.notes ?? null,
        solution_code: input.solution_code ?? null,
        solution_language: input.solution_language ?? null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['problems'] })
      qc.invalidateQueries({ queryKey: ['review-queue'] })
    },
  })
}
