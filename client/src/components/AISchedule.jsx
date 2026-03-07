import { motion } from 'framer-motion'
import { CalendarClock, RefreshCcw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/axios'
import { successToast } from '../utils/toast'

function Row({ time, task }) {
  return (
    <div className='flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3'>
      <div className='w-[92px] shrink-0 text-xs font-semibold text-white/80'>{time}</div>
      <div className='min-w-0 text-sm text-white/80'>{task}</div>
    </div>
  )
}

export default function AISchedule() {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchSchedule = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/ai/schedule')
      setSchedule(res.data.schedule || [])
      if (res.data.schedule?.length) {
        successToast('AI suggestions generated')
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to generate schedule')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSchedule()
  }, [fetchSchedule])

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className='glass p-4'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <div className='grid h-9 w-9 place-items-center rounded-2xl border border-white/20 bg-white/10'>
            <CalendarClock className='h-4 w-4 text-indigo-300' />
          </div>
          <div>
            <div className='text-sm font-semibold'>AI Daily Planner 🤖</div>
            <div className='text-xs text-white/60'>Optimized schedule from your tasks</div>
          </div>
        </div>
        <button className='btn !px-3' onClick={fetchSchedule} disabled={loading} title='Refresh schedule'>
          <RefreshCcw className='h-4 w-4' />
          {loading ? 'Generating…' : 'Refresh'}
        </button>
      </div>

      {error ? (
        <div className='mt-3 rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200'>
          {error}
        </div>
      ) : null}

      <div className='mt-4 space-y-2'>
        {schedule?.length ? (
          schedule.map((s, idx) => <Row key={`${s.time}-${idx}`} time={s.time} task={s.task} />)
        ) : (
          <div className='rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/65'>
            No schedule yet. Add tasks (with deadlines/estimates) and refresh.
          </div>
        )}
      </div>
    </motion.div>
  )
}

