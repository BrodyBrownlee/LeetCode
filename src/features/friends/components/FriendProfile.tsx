import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'

export function FriendProfile() {
  const { id } = useParams<{ id: string }>()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['friend-profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_profile_stats')
        .select('*')
        .eq('user_id', id!)
        .single()
      if (error) throw error
      return data
    },
  })

  if (isLoading) return <p className="text-sm text-gray-500">Loading...</p>
  if (!stats) return <p className="text-sm text-red-400">Profile not found or not a friend.</p>

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">{stats.username}</h1>
          {stats.display_name && (
            <p className="text-sm text-gray-400">{stats.display_name}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500">Total solved</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total_problems_solved}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500">Current streak</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.current_streak}d</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-3">Activity</h2>
        <p className="text-xs text-gray-500">Heatmap available for your own profile.</p>
      </div>
    </div>
  )
}
