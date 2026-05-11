import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'

export function useReviewQueue() {
  return useQuery({
    queryKey: ['review-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problems')
        .select('*, problem_tags(tag_id, tags(id, name))')
        .lte('next_review_at', new Date().toISOString())
        .not('next_review_at', 'is', null)
        .order('next_review_at', { ascending: true })
      if (error) throw error
      return data
    },
  })
}
