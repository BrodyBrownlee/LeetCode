import { useState } from 'react'
import { Link } from 'react-router'
import { useReviewQueue } from '../hooks/useReviewQueue'
import { useSubmitReview } from '../../attempts/hooks/useAttempts'
import { AttemptForm } from '../../attempts/components/AttemptForm'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import type { Confidence } from '../../../lib/db-types'

function daysOverdue(nextReviewAt: string): number {
  const diff = Date.now() - new Date(nextReviewAt).getTime()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

export function ReviewQueue() {
  const { data: problems = [], isLoading } = useReviewQueue()
  const submitReview = useSubmitReview()
  const [reviewing, setReviewing] = useState<typeof problems[0] | null>(null)

  async function handleReviewSubmit(values: {
    confidence: Confidence
    time_spent_minutes?: number
    notes?: string
    solution_code?: string
    solution_language?: string
  }) {
    if (!reviewing) return
    await submitReview.mutateAsync({
      problemId: reviewing.id,
      currentIntervalDays: reviewing.current_interval_days,
      easeFactor: reviewing.ease_factor,
      ...values,
    })
    setReviewing(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Review Queue</h1>
        <Badge color={problems.length > 0 ? 'yellow' : 'default'}>
          {problems.length} due
        </Badge>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading...</p>}

      {!isLoading && problems.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-400">You're all caught up!</p>
          <p className="text-sm text-gray-600 mt-1">No problems due for review.</p>
        </div>
      )}

      <ul className="divide-y divide-gray-800">
        {problems.map(problem => {
          const overdue = daysOverdue(problem.next_review_at!)
          return (
            <li key={problem.id} className="flex items-center gap-4 py-4">
              <div className="flex-1 min-w-0">
                <Link
                  to={`/problems/${problem.id}`}
                  className="text-sm font-medium text-white hover:text-indigo-400 transition-colors"
                >
                  {problem.leetcode_number ? `#${problem.leetcode_number} ` : ''}{problem.title}
                </Link>
                <p className="text-xs text-gray-500 mt-0.5">
                  {overdue === 0 ? 'Due today' : `${overdue} day${overdue > 1 ? 's' : ''} overdue`}
                </p>
              </div>
              <Button size="sm" onClick={() => setReviewing(problem)}>
                Review
              </Button>
            </li>
          )
        })}
      </ul>

      <Modal
        open={reviewing !== null}
        onClose={() => setReviewing(null)}
        title={reviewing ? `Review: ${reviewing.title}` : undefined}
      >
        <AttemptForm
          onSubmit={handleReviewSubmit}
          onCancel={() => setReviewing(null)}
        />
      </Modal>
    </div>
  )
}
