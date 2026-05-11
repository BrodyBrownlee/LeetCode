import { useMemo } from 'react'

interface AttemptDate {
  solved_at: string
}

export function useStreaks(attempts: AttemptDate[]) {
  return useMemo(() => {
    if (attempts.length === 0) return { current: 0, longest: 0 }

    const days = [
      ...new Set(
        attempts.map(a => new Date(a.solved_at).toLocaleDateString('en-CA'))
      ),
    ].sort()

    let current = 0
    let longest = 0
    let streak = 1

    const today = new Date().toLocaleDateString('en-CA')
    const yesterday = new Date(Date.now() - 864e5).toLocaleDateString('en-CA')

    for (let i = 1; i < days.length; i++) {
      const prev = new Date(days[i - 1])
      const curr = new Date(days[i])
      const diff = (curr.getTime() - prev.getTime()) / 864e5
      if (diff === 1) {
        streak++
      } else {
        longest = Math.max(longest, streak)
        streak = 1
      }
    }
    longest = Math.max(longest, streak)

    const lastDay = days[days.length - 1]
    current = lastDay === today || lastDay === yesterday ? streak : 0

    return { current, longest }
  }, [attempts])
}
