type BadgeColor = 'default' | 'green' | 'yellow' | 'red' | 'blue'

interface BadgeProps {
  children: React.ReactNode
  color?: BadgeColor
}

const colorClasses: Record<BadgeColor, string> = {
  default: 'bg-gray-800 text-gray-300',
  green: 'bg-green-900/40 text-green-400',
  yellow: 'bg-yellow-900/40 text-yellow-400',
  red: 'bg-red-900/40 text-red-400',
  blue: 'bg-indigo-900/40 text-indigo-400',
}

export function Badge({ children, color = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClasses[color]}`}>
      {children}
    </span>
  )
}
