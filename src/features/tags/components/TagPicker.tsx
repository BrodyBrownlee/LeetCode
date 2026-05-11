import { useState } from 'react'
import { useTags, useCreateTag } from '../hooks/useTags'
import { Badge } from '../../../components/ui/Badge'

interface TagPickerProps {
  selected: string[]
  onChange: (ids: string[]) => void
}

export function TagPicker({ selected, onChange }: TagPickerProps) {
  const { data: tags = [] } = useTags()
  const createTag = useCreateTag()
  const [input, setInput] = useState('')

  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])
  }

  async function handleCreate(e: React.KeyboardEvent) {
    if (e.key !== 'Enter' || !input.trim()) return
    e.preventDefault()
    const tag = await createTag.mutateAsync(input.trim())
    onChange([...selected, tag.id])
    setInput('')
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-400">Topics</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggle(tag.id)}
            className="transition-opacity"
          >
            <Badge color={selected.includes(tag.id) ? 'blue' : 'default'}>
              {tag.name}
            </Badge>
          </button>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleCreate}
        placeholder="Add custom tag… (Enter)"
        className="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  )
}
