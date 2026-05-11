import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '../../../lib/supabase'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'

const schema = z.object({
  username: z
    .string()
    .min(3, 'At least 3 characters')
    .max(20, 'At most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, and underscores only'),
})

type FormValues = z.infer<typeof schema>

export function UsernameOnboarding() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit({ username }: FormValues) {
    setServerError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return navigate('/login')

    const { error } = await supabase.from('profiles').insert({
      id: user.id,
      username,
      avatar_url: (user.user_metadata.avatar_url as string) ?? null,
      display_name: (user.user_metadata.full_name as string) ?? null,
    })

    if (error) {
      setServerError(error.message.includes('unique') ? 'Username already taken.' : error.message)
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm space-y-6 p-8 bg-gray-900 rounded-xl border border-gray-800">
        <div>
          <h1 className="text-xl font-bold text-white">Choose a username</h1>
          <p className="mt-1 text-sm text-gray-400">This is how friends will find you.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register('username')}
            placeholder="your_username"
            error={errors.username?.message ?? serverError ?? undefined}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </div>
    </div>
  )
}
