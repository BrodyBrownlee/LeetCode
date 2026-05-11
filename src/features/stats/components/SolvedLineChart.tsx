import { useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAllAttempts } from '../hooks/useStats'

type Granularity = 'daily' | 'weekly' | 'monthly'

function groupByPeriod(
  attempts: { solved_at: string }[],
  granularity: Granularity,
): { period: string; count: number }[] {
  const map = new Map<string, number>()

  for (const a of attempts) {
    const d = new Date(a.solved_at)
    let key: string
    if (granularity === 'daily') {
      key = d.toLocaleDateString('en-CA')
    } else if (granularity === 'weekly') {
      const monday = new Date(d)
      monday.setDate(d.getDate() - d.getDay() + 1)
      key = monday.toLocaleDateString('en-CA')
    } else {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    }
    map.set(key, (map.get(key) ?? 0) + 1)
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, count]) => ({ period, count }))
}

export function SolvedLineChart() {
  const { data: attempts = [] } = useAllAttempts()
  const [granularity, setGranularity] = useState<Granularity>('weekly')
  const data = useMemo(() => groupByPeriod(attempts, granularity), [attempts, granularity])

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Problems solved over time</h2>
        <div className="flex gap-1">
          {(['daily', 'weekly', 'monthly'] as Granularity[]).map(g => (
            <button
              key={g}
              onClick={() => setGranularity(g)}
              className={`px-2 py-1 rounded text-xs capitalize transition-colors ${
                granularity === g ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="period" tick={{ fill: '#6b7280', fontSize: 11 }} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#e5e7eb' }}
            itemStyle={{ color: '#818cf8' }}
          />
          <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
