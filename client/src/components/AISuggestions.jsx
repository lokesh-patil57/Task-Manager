import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

function label(v) {
  if (v == null || v === '') return '—'
  return String(v)
}

function formatDate(d) {
  if (!d) return '—'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return '—'
  const now = new Date()
  const diffDays = Math.round((date - now) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function AISuggestions({ task }) {
  const ai = task?.ai || null

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className='glass p-4'>
      <div className='flex items-center gap-2'>
        <div className='grid h-9 w-9 place-items-center rounded-2xl border border-white/20 bg-white/10'>
          <Sparkles className='h-4 w-4 text-indigo-300' />
        </div>
        <div>
          <div className='text-sm font-semibold'>AI Assistant</div>
          <div className='text-xs text-white/60'>Gemini task analysis</div>
        </div>
      </div>

      <div className='mt-4 space-y-3 text-sm'>
        <div className='flex items-center justify-between gap-3'>
          <div className='text-white/65'>Priority</div>
          <div className='badge bg-indigo-500/15 border-indigo-400/30 text-indigo-100'>
            {label(ai?.priority || task?.priority)}
          </div>
        </div>
        <div className='flex items-center justify-between gap-3'>
          <div className='text-white/65'>Estimated Time</div>
          <div className='text-white/90'>
            {ai?.estimatedTime ?? task?.estimatedTime ? `${ai?.estimatedTime ?? task?.estimatedTime} hours` : '—'}
          </div>
        </div>
        <div className='flex items-center justify-between gap-3'>
          <div className='text-white/65'>Deadline</div>
          <div className='text-white/90'>{formatDate(ai?.suggestedDeadline || task?.deadline)}</div>
        </div>

        <div className='mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/65'>
          {task
            ? 'Tip: You can still override priority / deadline manually in the task modal.'
            : 'Select a task to see AI suggestions. New tasks are analyzed automatically.'}
        </div>
      </div>
    </motion.div>
  )
}

