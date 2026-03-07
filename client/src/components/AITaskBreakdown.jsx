import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, ListTodo, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '../api/axios'
import { successToast } from '../utils/toast'

export default function AITaskBreakdown({ open, title, onClose }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [subtasks, setSubtasks] = useState([])

  const generate = async () => {
    if (!title) return
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/ai/breakdown', { title })
      setSubtasks(res.data.subtasks || [])
      if (res.data.subtasks?.length) {
        successToast('AI breakdown generated')
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to generate subtasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return
    setSubtasks([])
    setError('')
    generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, title])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 grid place-items-center bg-black/60 px-4'
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose?.()
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className='glass w-full max-w-xl p-5'
          >
            <div className='flex items-start justify-between gap-3'>
              <div className='flex items-center gap-3'>
                <div className='grid h-10 w-10 place-items-center rounded-2xl border border-white/20 bg-white/10'>
                  <Sparkles className='h-5 w-5 text-indigo-300' />
                </div>
                <div>
                  <div className='text-sm font-semibold'>AI Task Breakdown</div>
                  <div className='text-xs text-white/60'>Subtasks generated from your task title</div>
                </div>
              </div>
              <button className='btn !p-2' onClick={onClose} title='Close'>
                <X className='h-4 w-4' />
              </button>
            </div>

            <div className='mt-4'>
              <div className='rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80'>
                <div className='text-xs text-white/60'>Task</div>
                <div className='mt-1 font-semibold text-white'>{title || '—'}</div>
              </div>
            </div>

            {error ? (
              <div className='mt-3 rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200'>
                {error}
              </div>
            ) : null}

            <div className='mt-4 space-y-2'>
              {loading ? (
                <div className='rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70'>
                  Generating subtasks…
                </div>
              ) : subtasks?.length ? (
                <div className='space-y-2'>
                  {subtasks.map((s, idx) => (
                    <div
                      key={`${idx}-${s}`}
                      className='flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80'
                    >
                      <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0 text-emerald-300' />
                      <div className='min-w-0'>{s}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/65'>
                  <div className='flex items-center gap-2'>
                    <ListTodo className='h-4 w-4 text-white/60' />
                    No subtasks yet. Try again.
                  </div>
                </div>
              )}
            </div>

            <div className='mt-5 flex items-center justify-end gap-2'>
              <button className='btn' onClick={onClose}>
                Close
              </button>
              <button className='btn btn-primary' onClick={generate} disabled={loading || !title}>
                <Sparkles className='h-4 w-4' />
                Regenerate
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

