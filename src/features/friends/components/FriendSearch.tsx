import { useState } from 'react'
import { useSearchProfiles, useSendFriendRequest } from '../hooks/useFriends'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'

export function FriendSearch() {
  const [query, setQuery] = useState('')
  const { data: results = [] } = useSearchProfiles(query)
  const sendRequest = useSendFriendRequest()
  const [sent, setSent] = useState<Set<string>>(new Set())

  async function handleSend(userId: string) {
    await sendRequest.mutateAsync(userId)
    setSent(s => new Set(s).add(userId))
  }

  return (
    <div className="space-y-3">
      <Input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search by username..."
      />
      {results.length > 0 && (
        <ul className="bg-gray-900 border border-gray-800 rounded-lg divide-y divide-gray-800">
          {results.map(profile => (
            <li key={profile.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                {profile.avatar_url && (
                  <img src={profile.avatar_url} alt={profile.username} className="w-7 h-7 rounded-full" />
                )}
                <span className="text-sm text-white">{profile.username}</span>
              </div>
              <Button
                size="sm"
                variant="secondary"
                disabled={sent.has(profile.id)}
                onClick={() => handleSend(profile.id)}
              >
                {sent.has(profile.id) ? 'Sent' : 'Add friend'}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
