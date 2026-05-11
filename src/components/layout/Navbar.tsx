import { useAuth } from '../../features/auth/hooks/useAuth'

export function Navbar() {
  const { profile, signOut } = useAuth()

  return (
    <header className="border-b border-gray-800 px-6 py-3 flex items-center justify-end gap-4">
      {profile?.avatar_url && (
        <img
          src={profile.avatar_url}
          alt={profile.username}
          className="w-7 h-7 rounded-full"
        />
      )}
      <span className="text-sm text-gray-300">{profile?.username}</span>
      <button
        onClick={signOut}
        className="text-sm text-gray-500 hover:text-white transition-colors"
      >
        Sign out
      </button>
    </header>
  )
}
