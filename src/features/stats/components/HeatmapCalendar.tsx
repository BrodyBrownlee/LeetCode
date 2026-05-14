import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { useAllAttempts } from '../hooks/useStats'

export function HeatmapCalendar() {
  const { data: attempts = [] } = useAllAttempts()

  const countByDay = attempts.reduce<Record<string, number>>((acc, a) => {
    const day = new Date(a.solved_at).toLocaleDateString('en-CA')
    acc[day] = (acc[day] ?? 0) + 1
    return acc
  }, {})

  const values = Object.entries(countByDay).map(([date, count]) => ({ date, count }))

  const startDate = new Date()
  startDate.setFullYear(startDate.getFullYear() - 1)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
      <h2 className="text-sm font-semibold text-white">Activity</h2>
      <CalendarHeatmap
        startDate={startDate}
        endDate={new Date()}
        values={values}
        classForValue={value => {
          if (!value || value.count === 0) return 'fill-gray-800'
          if (value.count === 1) return 'fill-indigo-900'
          if (value.count === 2) return 'fill-indigo-700'
          if (value.count <= 4) return 'fill-indigo-500'
          return 'fill-indigo-400'
        }}
      />
    </div>
  )
}
