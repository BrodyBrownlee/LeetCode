import { useProblems } from '../../problems/hooks/useProblems'
import { useAllAttempts } from '../hooks/useStats'
import { useStreaks } from '../../streaks/hooks/useStreaks'
import { isDueForReview } from '../../../lib/spaced-repetition'

export function SummaryTiles() {
  const { data: problems = [] } = useProblems()
  const { data: attempts = [] } = useAllAttempts()
  const { current, longest } = useStreaks(attempts)
  const dueCount = problems.filter(p => isDueForReview(p.next_review_at)).length

  const tiles = [
    { label: 'Total solved', value: problems.length },
    { label: 'Current streak', value: `${current}d` },
    { label: 'Longest streak', value: `${longest}d` },
    { label: 'Due for review', value: dueCount },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map(({ label, value }) => (
        <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
      ))}
    </div>
  )
}
