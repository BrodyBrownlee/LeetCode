import { NavLink } from 'react-router'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/problems', label: 'Problems', end: false },
  { to: '/review', label: 'Review Queue', end: false },
  { to: '/friends', label: 'Friends', end: false },
]

export function Sidebar() {
  return (
    <nav className="w-56 border-r border-gray-800 flex flex-col py-6 shrink-0">
      <div className="px-6 mb-8">
        <span className="text-lg font-semibold text-white">LeetTrack</span>
      </div>
      <ul className="flex flex-col gap-1 px-3">
        {navItems.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
