import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'

export function useAllAttempts() {
  return useQuery({
    queryKey: ['all-attempts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attempts')
        .select('id, solved_at, problem_id, confidence')
        .order('solved_at', { ascending: true })
      if (error) throw error
      return data
    },
  })
}

export function useTagBreakdown() {
  return useQuery({
    queryKey: ['tag-breakdown'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problem_tags')
        .select('tag_id, tags(name)')
      if (error) throw error

      const counts: Record<string, { name: string; count: number }> = {}
      for (const row of data ?? []) {
        const tag = row.tags as { name: string } | null
        if (!tag) continue
        if (!counts[row.tag_id]) counts[row.tag_id] = { name: tag.name, count: 0 }
        counts[row.tag_id].count++
      }
      return Object.values(counts).sort((a, b) => b.count - a.count)
    },
  })
}
