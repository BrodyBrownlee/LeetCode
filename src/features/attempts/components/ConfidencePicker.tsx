import type { Confidence } from '../../../lib/db-types'

interface ConfidencePickerProps {
  value: Confidence | ''
  onChange: (value: Confidence) => void
}

const options: { value: Confidence; label: string; description: string; color: string }[] = [
  { value: 'again', label: 'Again', description: 'Reset to 1 day', color: 'border-red-600 bg-red-900/30 text-red-400' },
  { value: 'hard', label: 'Hard', description: 'Slow progress', color: 'border-orange-600 bg-orange-900/30 text-orange-400' },
  { value: 'good', label: 'Good', description: 'On track', color: 'border-blue-600 bg-blue-900/30 text-blue-400' },
  { value: 'easy', label: 'Easy', description: 'Boost interval', color: 'border-green-600 bg-green-900/30 text-green-400' },
]

export function ConfidencePicker({ value, onChange }: ConfidencePickerProps) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 mb-2">How did it feel?</p>
      <div className="grid grid-cols-4 gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${
              value === opt.value ? opt.color : 'border-gray-700 text-gray-500 hover:border-gray-600'
            }`}
          >
            <span className="text-sm font-semibold">{opt.label}</span>
            <span className="text-xs opacity-75">{opt.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
