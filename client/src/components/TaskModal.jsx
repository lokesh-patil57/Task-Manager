import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X, Loader2 } from 'lucide-react'
import { useState } from 'react'
import LoadingButton from './LoadingButton'
import { api } from '../api/axios'
import { successToast, errorToast, infoToast } from '../utils/toast'

const statuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Completed' },
]

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

function toInputDate(d) {
  if (!d) return ''
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return ''
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function fromInputDate(s) {
  if (!s) return null
  const d = new Date(`${s}T12:00:00`)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

function buildDefaults(initialTask) {
  return {
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    status: initialTask?.status || 'pending',
    priority: initialTask?.priority || 'medium',
    deadline: toInputDate(initialTask?.deadline),
    estimatedTime: initialTask?.estimatedTime ?? '',
  }
}

function TaskModalBody({ mode, initialTask, onClose, onSave }) {
  const isEdit = mode === 'edit'

  const [form, setForm] = useState(() => buildDefaults(initialTask))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  const handleAiSuggest = async () => {
    if (!form.title.trim() || form.title.trim().length < 3) {
      errorToast('Please enter a longer title for AI analysis.')
      return
    }

    setAiLoading(true)
    try {
      const res = await api.post('/tasks/analyze', { title: form.title })
      const { priority, estimatedTime, suggestedDeadline, raw } = res.data.analysis

      if (raw?.error) {
        errorToast('Heavy load on AI. Try again later.')
        return
      }

      setForm((p) => ({
        ...p,
        priority: priority || p.priority,
        estimatedTime: estimatedTime != null ? estimatedTime : p.estimatedTime,
        deadline: suggestedDeadline ? toInputDate(suggestedDeadline) : p.deadline,
      }))
      successToast('AI suggestions applied!')
    } catch (err) {
      const msg = err.response?.data?.message || 'AI completely unavailable right now.'
      if (msg.includes('429') || err.response?.status === 429) {
        errorToast('Heavy load on AI. Try again later.')
      } else {
        errorToast(msg)
      }
    } finally {
      setAiLoading(false)
    }
  }

  const handleRiskAnalyze = async () => {
    if (!form.title.trim() || form.title.trim().length < 3) {
      errorToast('Please enter a longer title to analyze risk.')
      return
    }

    setAiLoading(true)
    try {
      const payload = {
        title: form.title.trim(),
        deadline: form.deadline ? fromInputDate(form.deadline) : null,
        estimatedTime: form.estimatedTime === '' ? null : Number(form.estimatedTime),
      }

      const res = await api.post('/tasks/analyze-risk', payload)
      const { riskLevel, suggestion, raw } = res.data.risk

      if (raw?.error) {
        errorToast('Heavy load on AI. Try again later.')
        return
      }

      setForm((p) => ({
        ...p,
        riskLevel: riskLevel || p.riskLevel,
        ai: {
          ...p.ai,
          riskSuggestion: suggestion,
        }
      }))

      successToast(`Risk Level: ${riskLevel.toUpperCase()}. ${suggestion}`)
    } catch (err) {
      const msg = err.response?.data?.message || 'AI completely unavailable right now.'
      if (msg.includes('429') || err.response?.status === 429) {
        errorToast('Heavy load on AI. Try again later.')
      } else {
        errorToast(msg)
      }
    } finally {
      setAiLoading(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || form.title.trim().length < 3) {
      setError('Title must be at least 3 characters.')
      return
    }

    const payload = {
      title: form.title.trim(),
      description: form.description,
      status: form.status,
      priority: form.priority,
      deadline: form.deadline ? fromInputDate(form.deadline) : null,
      estimatedTime: form.estimatedTime === '' ? null : Number(form.estimatedTime),
      riskLevel: form.riskLevel || 'low',
      ai: form.ai,
    }

    setSaving(true)
    try {
      const res = await onSave(payload)
      if (!res?.ok) {
        setError(res?.message || 'Something went wrong')
        return
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-50 grid place-items-center bg-black/60 px-4'
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className='glass w-full max-w-xl p-5'
      >
        <div className='flex items-start justify-between gap-3'>
          <div>
            <div className='text-xs text-white/60'>{isEdit ? 'Edit task' : 'New task'}</div>
            <div className='text-xl flex items-center gap-2 font-semibold tracking-tight'>
              {isEdit ? 'Update task details' : 'Create a task'}
              {!isEdit && (
                <button
                  type="button"
                  onClick={handleAiSuggest}
                  disabled={aiLoading}
                  className="inline-flex items-center gap-1 ml-2 rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-300 hover:bg-indigo-500/30 transition-colors"
                >
                  {aiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  AI Auto-Fill
                </button>
              )}
              <button
                type="button"
                onClick={handleRiskAnalyze}
                disabled={aiLoading}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/30 transition-colors"
              >
                {aiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                Analyze Risk
              </button>
            </div>
          </div>
          <button className='btn !p-2' onClick={onClose} title='Close'>
            <X className='h-4 w-4' />
          </button>
        </div>

        <form onSubmit={submit} className='mt-4 grid grid-cols-1 gap-3 md:grid-cols-2'>
          <label className='md:col-span-2'>
            <div className='mb-1 text-xs text-white/60'>Title</div>
            <input
              className='input'
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder='Ship onboarding flow'
            />
          </label>

          <label className='md:col-span-2'>
            <div className='mb-1 text-xs text-white/60'>Description</div>
            <textarea
              className='input min-h-[90px]'
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder='Context, acceptance criteria, notes…'
            />
          </label>

          <label>
            <div className='mb-1 text-xs text-white/60'>Status</div>
            <select
              className='input'
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <div className='mb-1 text-xs text-white/60'>Priority</div>
            <select
              className='input'
              value={form.priority}
              onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
            >
              {priorities.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <div className='mb-1 text-xs text-white/60'>Deadline</div>
            <input
              className='input'
              value={form.deadline}
              onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))}
              type='date'
            />
          </label>

          <label>
            <div className='mb-1 text-xs text-white/60'>Estimated Time (hours)</div>
            <input
              className='input'
              value={form.estimatedTime}
              onChange={(e) => setForm((p) => ({ ...p, estimatedTime: e.target.value }))}
              type='number'
              step='0.25'
              min='0'
              placeholder='3'
            />
          </label>

          {error ? (
            <div className='md:col-span-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200'>
              {error}
            </div>
          ) : null}

          <div className='md:col-span-2 flex items-center justify-end gap-2 pt-2'>
            <button type='button' className='btn' onClick={onClose}>
              Cancel
            </button>
            <LoadingButton
              type='submit'
              isLoading={saving}
              text={isEdit ? 'Save changes' : 'Create task'}
              loadingText={isEdit ? 'Saving…' : 'Creating…'}
            />
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function TaskModal({ open, mode, initialTask, onClose, onSave }) {
  return (
    <AnimatePresence>
      {open ? (
        <TaskModalBody
          key={`${mode}-${initialTask?._id || 'new'}`}
          mode={mode}
          initialTask={initialTask}
          onClose={onClose}
          onSave={onSave}
        />
      ) : null}
    </AnimatePresence>
  )
}

