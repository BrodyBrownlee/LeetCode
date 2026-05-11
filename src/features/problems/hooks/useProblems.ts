import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import { computeNextReview } from '../../../lib/spaced-repetition'
import type { Confidence } from '../../../lib/db-types'

export function useProblems() {
  return useQuery({
    queryKey: ['problems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problems')
        .select('*, problem_tags(tag_id, tags(id, name))')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useProblem(id: string) {
  return useQuery({
    queryKey: ['problems', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problems')
        .select('*, attempts(*), problem_tags(tag_id, tags(id, name))')
        .eq('id', id)
        .order('solved_at', { referencedTable: 'attempts', ascending: false })
        .single()
      if (error) throw error
      return data
    },
  })
}

interface LogProblemInput {
  leetcode_number?: number
  title: string
  url?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  tag_ids: string[]
  time_spent_minutes?: number
  confidence: Confidence
  notes?: string
  solution_code?: string
  solution_language?: string
}

export function useLogProblem() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: LogProblemInput) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: existing } = await supabase
        .from('problems')
        .select('id, current_interval_days, ease_factor')
        .eq('user_id', user.id)
        .eq('leetcode_number', input.leetcode_number ?? 0)
        .maybeSingle()

      const schedule = computeNextReview(
        input.confidence,
        existing?.current_interval_days ?? 0,
        existing?.ease_factor ?? 2.5,
      )

      let problemId: string

      if (existing) {
        await supabase.from('problems').update({
          ease_factor: schedule.newEaseFactor,
          current_interval_days: schedule.nextIntervalDays,
          next_review_at: schedule.nextReviewAt.toISOString(),
        }).eq('id', existing.id)
        problemId = existing.id
      } else {
        const { data, error } = await supabase.from('problems').insert({
          user_id: user.id,
          leetcode_number: input.leetcode_number ?? null,
          title: input.title,
          url: input.url ?? null,
          difficulty: input.difficulty ?? null,
          ease_factor: schedule.newEaseFactor,
          current_interval_days: schedule.nextIntervalDays,
          next_review_at: schedule.nextReviewAt.toISOString(),
        }).select('id').single()
        if (error) throw error
        problemId = data.id

        if (input.tag_ids.length > 0) {
          await supabase.from('problem_tags').insert(
            input.tag_ids.map(tag_id => ({ problem_id: problemId, tag_id }))
          )
        }
      }

      const { error: attemptError } = await supabase.from('attempts').insert({
        problem_id: problemId,
        user_id: user.id,
        confidence: input.confidence,
        time_spent_minutes: input.time_spent_minutes ?? null,
        notes: input.notes ?? null,
        solution_code: input.solution_code ?? null,
        solution_language: input.solution_language ?? null,
      })
      if (attemptError) throw attemptError
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['problems'] }),
  })
}
