import { usePendingRequests, useRespondToRequest } from '../hooks/useFriends'
import { Button } from '../../../components/ui/Button'

export function FriendRequests() {
  const { data: requests = [] } = usePendingRequests()
  const respond = useRespondToRequest()

  if (requests.length === 0) return null

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-white">Pending requests ({requests.length})</h2>
      <ul className="bg-gray-900 border border-gray-800 rounded-lg divide-y divide-gray-800">
        {requests.map(req => {
          const requester = req.requester as { id: string; username: string; avatar_url: string | null } | null
          return (
            <li key={req.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                {requester?.avatar_url && (
                  <img src={requester.avatar_url} alt={requester.username} className="w-7 h-7 rounded-full" />
                )}
                <span className="text-sm text-white">{requester?.username}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => respond.mutate({ id: req.id, accept: true })}>
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => respond.mutate({ id: req.id, accept: false })}
                >
                  Decline
                </Button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
