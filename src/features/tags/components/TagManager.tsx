import { useState } from 'react'
import { useTags, useCreateTag } from '../hooks/useTags'
import { Badge } from '../../../components/ui/Badge'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'

export function TagManager() {
  const { data: tags = [] } = useTags()
  const createTag = useCreateTag()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setError(null)
    try {
      await createTag.mutateAsync(name.trim())
      setName('')
    } catch (err: any) {
      setError(err.message.includes('unique') ? 'Tag already exists.' : err.message)
    }
  }

  const customTags = tags.filter(t => t.user_id !== null)
  const seedTags = tags.filter(t => t.user_id === null)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-white mb-2">Custom tags</h3>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {customTags.length === 0 && (
            <p className="text-xs text-gray-500">None yet.</p>
          )}
          {customTags.map(t => <Badge key={t.id} color="blue">{t.name}</Badge>)}
        </div>
        <form onSubmit={handleCreate} className="flex gap-2">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="New tag name"
            error={error ?? undefined}
          />
          <Button type="submit" disabled={createTag.isPending} size="sm">
            Add
          </Button>
        </form>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white mb-2">Default topics</h3>
        <div className="flex flex-wrap gap-1.5">
          {seedTags.map(t => <Badge key={t.id}>{t.name}</Badge>)}
        </div>
      </div>
    </div>
  )
}
