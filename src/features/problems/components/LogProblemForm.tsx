import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import MonacoEditor from '@monaco-editor/react'
import { useLogProblem } from '../hooks/useProblems'
import { ConfidencePicker } from '../../attempts/components/ConfidencePicker'
import { TagPicker } from '../../tags/components/TagPicker'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import type { Confidence } from '../../../lib/db-types'

const LANGUAGES = ['python', 'javascript', 'typescript', 'java', 'cpp', 'go', 'rust']

const schema = z.object({
  url: z.string().url('Enter a valid LeetCode URL').optional().or(z.literal('')),
  leetcode_number: z.coerce.number().int().positive().optional(),
  title: z.string().min(1, 'Title is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  time_spent_minutes: z.coerce.number().int().positive().optional(),
  confidence: z.enum(['again', 'hard', 'good', 'easy'], { required_error: 'Select a confidence rating' }),
  notes: z.string().optional(),
  solution_code: z.string().optional(),
  solution_language: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function parseLeetCodeUrl(url: string): { number: null; title: string | null } {
  try {
    const u = new URL(url)
    const match = u.pathname.match(/\/problems\/([^/]+)/)
    if (!match) return { number: null, title: null }
    const title = match[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    return { number: null, title }
  } catch {
    return { number: null, title: null }
  }
}

export function LogProblemForm() {
  const navigate = useNavigate()
  const logProblem = useLogProblem()
  const [tagIds, setTagIds] = useState<string[]>([])
  const [language, setLanguage] = useState('python')

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  function handleUrlBlur(e: React.FocusEvent<HTMLInputElement>) {
    const parsed = parseLeetCodeUrl(e.target.value)
    if (parsed.title) setValue('title', parsed.title)
  }

  async function onSubmit(values: FormValues) {
    await logProblem.mutateAsync({
      ...values,
      confidence: values.confidence as Confidence,
      tag_ids: tagIds,
      solution_language: language,
    })
    navigate('/problems')
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold text-white">Log a problem</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          {...register('url', { onBlur: handleUrlBlur })}
          label="LeetCode URL"
          placeholder="https://leetcode.com/problems/two-sum/"
          error={errors.url?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register('leetcode_number')}
            label="Problem #"
            type="number"
            placeholder="1"
            error={errors.leetcode_number?.message}
          />
          <Input
            {...register('title')}
            label="Title"
            placeholder="Two Sum"
            error={errors.title?.message}
          />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-400">Difficulty</p>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as const).map(d => (
              <label key={d} className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" value={d} {...register('difficulty')} className="sr-only" />
                <span className={`px-3 py-1 rounded text-xs font-medium border cursor-pointer transition-colors ${
                  watch('difficulty') === d
                    ? d === 'easy' ? 'bg-green-900/40 border-green-600 text-green-400'
                    : d === 'medium' ? 'bg-yellow-900/40 border-yellow-600 text-yellow-400'
                    : 'bg-red-900/40 border-red-600 text-red-400'
                    : 'border-gray-700 text-gray-500'
                }`}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <TagPicker selected={tagIds} onChange={setTagIds} />

        <Input
          {...register('time_spent_minutes')}
          label="Time spent (minutes)"
          type="number"
          placeholder="30"
          error={errors.time_spent_minutes?.message}
        />

        <Controller
          name="confidence"
          control={control}
          render={({ field }) => (
            <ConfidencePicker value={field.value ?? ''} onChange={field.onChange} />
          )}
        />
        {errors.confidence && (
          <p className="text-xs text-red-400">{errors.confidence.message}</p>
        )}

        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-400">Notes (markdown)</p>
          <textarea
            {...register('notes')}
            rows={4}
            placeholder="Key insights, patterns, edge cases..."
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
                  height="280px"
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

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Log problem'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
