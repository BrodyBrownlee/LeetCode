import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import MonacoEditor from '@monaco-editor/react'
import { ConfidencePicker } from './ConfidencePicker'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'

const LANGUAGES = ['python', 'javascript', 'typescript', 'java', 'cpp', 'go', 'rust']

const schema = z.object({
  confidence: z.enum(['again', 'hard', 'good', 'easy'], { required_error: 'Required' }),
  time_spent_minutes: z.coerce.number().int().positive().optional(),
  notes: z.string().optional(),
  solution_code: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface AttemptFormProps {
  onSubmit: (values: FormValues & { solution_language: string }) => Promise<void>
  onCancel?: () => void
}

export function AttemptForm({ onSubmit, onCancel }: AttemptFormProps) {
  const [language, setLanguage] = useState('python')

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function submit(values: FormValues) {
    await onSubmit({ ...values, solution_language: language })
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <Controller
        name="confidence"
        control={control}
        render={({ field }) => (
          <ConfidencePicker value={field.value ?? ''} onChange={field.onChange} />
        )}
      />
      {errors.confidence && <p className="text-xs text-red-400">{errors.confidence.message}</p>}

      <Input
        {...register('time_spent_minutes')}
        label="Time spent (minutes)"
        type="number"
        placeholder="30"
        error={errors.time_spent_minutes?.message}
      />

      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-400">Notes</p>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-400">Solution</p>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded text-xs text-white px-2 py-1"
          >
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="rounded-lg overflow-hidden border border-gray-700">
          <Controller
            name="solution_code"
            control={control}
            render={({ field }) => (
              <MonacoEditor
                height="220px"
                language={language}
                value={field.value ?? ''}
                onChange={v => field.onChange(v ?? '')}
                theme="vs-dark"
                options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
              />
            )}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Submit'}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        )}
      </div>
    </form>
  )
}
