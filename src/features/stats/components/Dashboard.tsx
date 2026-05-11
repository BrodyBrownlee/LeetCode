import { SummaryTiles } from './SummaryTiles'
import { SolvedLineChart } from './SolvedLineChart'
import { TopicBreakdownChart } from './TopicBreakdownChart'
import { HeatmapCalendar } from './HeatmapCalendar'

export function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-white">Dashboard</h1>
      <SummaryTiles />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SolvedLineChart />
        <TopicBreakdownChart />
      </div>
      <HeatmapCalendar />
    </div>
  )
}
