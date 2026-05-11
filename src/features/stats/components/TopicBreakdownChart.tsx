import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useTagBreakdown } from '../hooks/useStats'

export function TopicBreakdownChart() {
  const { data = [] } = useTagBreakdown()
  const top = data.slice(0, 10)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <h2 className="text-sm font-semibold text-white">Topic breakdown</h2>
      {top.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">No data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={top} layout="vertical">
            <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} width={90} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
              labelStyle={{ color: '#e5e7eb' }}
              itemStyle={{ color: '#818cf8' }}
            />
            <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
