import { useState } from 'react'
import { Link } from 'react-router'
import { useProblems } from '../hooks/useProblems'
import { useTags } from '../../tags/hooks/useTags'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import type { Difficulty } from '../../../lib/db-types'

const difficultyColor: Record<Difficulty, 'green' | 'yellow' | 'red'> = {
  easy: 'green',
  medium: 'yellow',
  hard: 'red',
}

export function ProblemList() {
  const { data: problems = [], isLoading } = useProblems()
  const { data: tags = [] } = useTags()
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | ''>('')
  const [filterTagId, setFilterTagId] = useState('')

  const filtered = problems.filter(p => {
    if (filterDifficulty && p.difficulty !== filterDifficulty) return false
    if (filterTagId) {
      const ptags = (p as any).problem_tags as { tag_id: string }[]
      if (!ptags?.some(pt => pt.tag_id === filterTagId)) return false
    }
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Problems</h1>
        <Button as={Link} asChild>
          <Link to="/problems/new">Log a problem</Link>
        </Button>
      </div>

      <div className="flex gap-3">
        <select
          value={filterDifficulty}
          onChange={e => setFilterDifficulty(e.target.value as Difficulty | '')}
          className="bg-gray-800 border border-gray-700 rounded-lg text-sm text-white px-3 py-1.5"
        >
          <option value="">All difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select
          value={filterTagId}
          onChange={e => setFilterTagId(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg text-sm text-white px-3 py-1.5"
        >
          <option value="">All topics</option>
          {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading...</p>}

      {!isLoading && filtered.length === 0 && (
        <p className="text-sm text-gray-500">
          {problems.length === 0 ? 'No problems logged yet.' : 'No problems match the current filters.'}
        </p>
      )}

      <ul className="divide-y divide-gray-800">
        {filtered.map(problem => (
          <li key={problem.id}>
            <Link
              to={`/problems/${problem.id}`}
              className="flex items-center gap-4 py-3.5 hover:bg-gray-900 -mx-2 px-2 rounded-lg transition-colors"
            >
              <span className="text-sm text-gray-500 w-10 shrink-0">
                {problem.leetcode_number ? `#${problem.leetcode_number}` : '—'}
              </span>
              <span className="text-sm text-white flex-1">{problem.title}</span>
              {problem.difficulty && (
                <Badge color={difficultyColor[problem.difficulty]}>
                  {problem.difficulty}
                </Badge>
              )}
              {problem.next_review_at && new Date(problem.next_review_at) <= new Date() && (
                <Badge color="yellow">due</Badge>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
