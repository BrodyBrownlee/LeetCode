import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'

export function useFriends() {
  return useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('friendships')
        .select('*, requester:profiles!requester_id(id, username, avatar_url), addressee:profiles!addressee_id(id, username, avatar_url)')
        .eq('status', 'accepted')
      if (error) throw error

      return (data ?? []).map(f => {
        const friend = f.requester_id === user.id ? f.addressee : f.requester
        return { friendshipId: f.id, friend: friend as { id: string; username: string; avatar_url: string | null } }
      })
    },
  })
}

export function usePendingRequests() {
  return useQuery({
    queryKey: ['friend-requests'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('friendships')
        .select('*, requester:profiles!requester_id(id, username, avatar_url)')
        .eq('addressee_id', user.id)
        .eq('status', 'pending')
      if (error) throw error
      return data ?? []
    },
  })
}

export function useSearchProfiles(query: string) {
  return useQuery({
    queryKey: ['profile-search', query],
    queryFn: async () => {
      if (!query.trim()) return []
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', `%${query}%`)
        .limit(10)
      if (error) throw error
      return data ?? []
    },
    enabled: query.length > 1,
  })
}

export function useSendFriendRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (addresseeId: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase.from('friendships').insert({
        requester_id: user.id,
        addressee_id: addresseeId,
      })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['friends'] }),
  })
}

export function useRespondToRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, accept }: { id: string; accept: boolean }) => {
      if (accept) {
        await supabase.from('friendships').update({ status: 'accepted' }).eq('id', id)
      } else {
        await supabase.from('friendships').delete().eq('id', id)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['friends'] })
      qc.invalidateQueries({ queryKey: ['friend-requests'] })
    },
  })
}

export function useRemoveFriend() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (friendshipId: string) => {
      await supabase.from('friendships').delete().eq('id', friendshipId)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['friends'] }),
  })
}
