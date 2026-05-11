import { supabase } from '../../../lib/supabase'

export function SignInPage() {
  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  async function signInWithGitHub() {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm space-y-6 p-8 bg-gray-900 rounded-xl border border-gray-800">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-white">LeetTrack</h1>
          <p className="text-sm text-gray-400">Track your LeetCode progress</p>
        </div>
        <div className="space-y-3">
          <button
            onClick={signInWithGoogle}
            className="w-full py-2 px-4 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Continue with Google
          </button>
          <button
            onClick={signInWithGitHub}
            className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-700"
          >
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  )
}
