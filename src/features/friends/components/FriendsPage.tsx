import { Link } from 'react-router'
import { useFriends, useRemoveFriend } from '../hooks/useFriends'
import { FriendSearch } from './FriendSearch'
import { FriendRequests } from './FriendRequests'
import { Button } from '../../../components/ui/Button'

export function FriendsPage() {
  const { data: friends = [] } = useFriends()
  const removeFriend = useRemoveFriend()

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-semibold text-white">Friends</h1>

      <FriendRequests />

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-white">Find friends</h2>
        <FriendSearch />
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-white">Your friends ({friends.length})</h2>
        {friends.length === 0 && (
          <p className="text-sm text-gray-500">No friends yet. Search above to add one.</p>
        )}
        <ul className="divide-y divide-gray-800">
          {friends.map(({ friendshipId, friend }) => (
            <li key={friendshipId} className="flex items-center justify-between py-3">
              <Link
                to={`/friends/${friend.id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                {friend.avatar_url && (
                  <img src={friend.avatar_url} alt={friend.username} className="w-8 h-8 rounded-full" />
                )}
                <span className="text-sm font-medium text-white">{friend.username}</span>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFriend.mutate(friendshipId)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
