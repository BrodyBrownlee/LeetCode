import { useParams, Link } from 'react-router'
import ReactMarkdown from 'react-markdown'
import MonacoEditor from '@monaco-editor/react'
import { useProblem } from '../hooks/useProblems'
import { Badge } from '../../../components/ui/Badge'
import type { Difficulty } from '../../../lib/db-types'

const difficultyColor: Record<Difficulty, 'green' | 'yellow' | 'red'> = {
  easy: 'green',
  medium: 'yellow',
  hard: 'red',
}

export function ProblemDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: problem, isLoading } = useProblem(id!)

  if (isLoading) return <p className="text-sm text-gray-500">Loading...</p>
  if (!problem) return <p className="text-sm text-red-400">Problem not found.</p>

  const attempts = (problem as any).attempts as any[] ?? []

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-white">
            {problem.leetcode_number ? `#${problem.leetcode_number} ` : ''}{problem.title}
          </h1>
          <div className="flex items-center gap-2">
            {problem.difficulty && (
              <Badge color={difficultyColor[problem.difficulty]}>{problem.difficulty}</Badge>
            )}
            {problem.url && (
              <a
                href={problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Open on LeetCode ↗
              </a>
            )}
          </div>
        </div>
        <Link
          to="/problems/new"
          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-500 transition-colors"
        >
          Log attempt
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Attempts ({attempts.length})
        </h2>
        {attempts.map((attempt: any) => (
          <div key={attempt.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge
                  color={
                    attempt.confidence === 'easy' ? 'green'
                    : attempt.confidence === 'good' ? 'blue'
                    : attempt.confidence === 'hard' ? 'yellow'
                    : 'red'
                  }
                >
                  {attempt.confidence}
                </Badge>
                <span className="text-xs text-gray-500">
                  {new Date(attempt.solved_at).toLocaleDateString()}
                </span>
                {attempt.time_spent_minutes && (
                  <span className="text-xs text-gray-500">{attempt.time_spent_minutes} min</span>
                )}
              </div>
            </div>

            {attempt.notes && (
              <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                <ReactMarkdown>{attempt.notes}</ReactMarkdown>
              </div>
            )}

            {attempt.solution_code && (
              <div className="rounded-lg overflow-hidden border border-gray-700">
                <MonacoEditor
                  height="200px"
                  language={attempt.solution_language ?? 'python'}
                  value={attempt.solution_code}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
