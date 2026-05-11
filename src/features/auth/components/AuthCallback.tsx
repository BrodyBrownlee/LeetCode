import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../../lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    let done = false

    async function redirect(session: Session) {
      if (done) return
      done = true

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle()

      navigate(profile ? '/' : '/welcome', { replace: true })
    }

    // Covers both implicit (hash tokens) and PKCE (code exchange) flows
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        redirect(session)
      }
    })

    // Belt-and-suspenders: if the session was set before the listener attached
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) redirect(session)
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <p className="text-gray-400 text-sm">Signing you in...</p>
    </div>
  )
}
