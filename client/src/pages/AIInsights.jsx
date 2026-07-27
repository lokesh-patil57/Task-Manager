import { motion } from 'framer-motion'
import { AlertTriangle, BarChart3, CheckCircle2, Clock, ListTodo, Sparkles, Target } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/axios'
import AIProductivityTip from '../components/AIProductivityTip'
import AISchedule from '../components/AISchedule'
import ProductivityInsights from '../components/ProductivityInsights'
import SkeletonCard from '../components/SkeletonCard'

export default function AIInsights() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get('/tasks')
        setTasks(res.data.tasks || [])
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load AI insights')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const summary = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter((t) => t.status === 'done').length
    const pending = tasks.filter((t) => t.status === 'pending').length
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length
    const highPriority = tasks.filter((t) => t.priority === 'high').length
    const overdue = tasks.filter(
      (t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done'
    ).length
    const score = total ? Math.round((done / total) * 100) : 0
    return { total, done, pending, inProgress, highPriority, overdue, score }
  }, [tasks])

  if (loading) {
    return (
      <div className='space-y-4'>
        <div>
          <SkeletonCard className='h-3 w-24' />
          <div className='mt-2'>
            <SkeletonCard className='h-5 w-40' />
          </div>
        </div>
        <SkeletonCard className='h-[420px]' />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className='space-y-4'
    >
      {/* Header */}
      <div>
        <div className='text-xs text-white/60'>AI-Powered Analysis</div>
        <div className='text-xl font-semibold tracking-tight flex items-center gap-2'>
          <Sparkles className='h-5 w-5 text-purple-300' />
          AI Insights
        </div>
      </div>

      {error ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className='glass-subtle border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200'
        >
          {error}
        </motion.div>
      ) : null}

      {/* Main grid: Charts | AI Widgets */}
      <div className='grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]'>
        <div className='space-y-4'>
          <ProductivityInsights tasks={tasks} />
        </div>

        <div className='space-y-4'>
          <AIProductivityTip tasks={tasks} />
          <AISchedule />
        </div>
      </div>

      {/* AI Insights Summary */}
      <div className='glass p-5'>
        <div className='flex items-center gap-2'>
          <div className='grid h-8 w-8 place-items-center rounded-xl border border-indigo-400/30 bg-indigo-400/10'>
            <BarChart3 className='h-4 w-4 text-indigo-300' />
          </div>
          <div>
            <div className='text-sm font-semibold'>AI Insights Summary</div>
            <div className='text-xs text-white/60'>High-level overview of your task landscape</div>
          </div>
        </div>

        <div className='mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6'>
          <div className='rounded-xl border border-white/10 bg-white/5 p-3 text-center'>
            <div className='flex items-center justify-center gap-1 text-xs text-white/60'>
              <ListTodo className='h-3.5 w-3.5' />
              Total
            </div>
            <div className='mt-1 text-xl font-semibold tracking-tight'>{summary.total}</div>
          </div>

          <div className='rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center'>
            <div className='flex items-center justify-center gap-1 text-xs text-emerald-300/80'>
              <CheckCircle2 className='h-3.5 w-3.5' />
              Done
            </div>
            <div className='mt-1 text-xl font-semibold tracking-tight text-emerald-200'>{summary.done}</div>
          </div>

          <div className='rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-center'>
            <div className='flex items-center justify-center gap-1 text-xs text-amber-300/80'>
              <Clock className='h-3.5 w-3.5' />
              Pending
            </div>
            <div className='mt-1 text-xl font-semibold tracking-tight text-amber-200'>{summary.pending}</div>
          </div>

          <div className='rounded-xl border border-sky-500/20 bg-sky-500/5 p-3 text-center'>
            <div className='flex items-center justify-center gap-1 text-xs text-sky-300/80'>
              <Target className='h-3.5 w-3.5' />
              In Progress
            </div>
            <div className='mt-1 text-xl font-semibold tracking-tight text-sky-200'>{summary.inProgress}</div>
          </div>

          <div className='rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-center'>
            <div className='flex items-center justify-center gap-1 text-xs text-red-300/80'>
              <AlertTriangle className='h-3.5 w-3.5' />
              High Priority
            </div>
            <div className='mt-1 text-xl font-semibold tracking-tight text-red-200'>{summary.highPriority}</div>
          </div>

          <div className='rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-center'>
            <div className='flex items-center justify-center gap-1 text-xs text-rose-300/80'>
              <AlertTriangle className='h-3.5 w-3.5' />
              Overdue
            </div>
            <div className='mt-1 text-xl font-semibold tracking-tight text-rose-200'>{summary.overdue}</div>
          </div>
        </div>

        {/* Productivity score bar */}
        <div className='mt-5'>
          <div className='flex items-center justify-between text-sm'>
            <div className='text-white/70'>Productivity Score</div>
            <div className='flex items-center gap-2'>
              <span className='text-xs text-white/60'>Completed / Total</span>
              <span className='font-semibold'>{summary.score}%</span>
            </div>
          </div>
          <div className='mt-2 h-3 overflow-hidden rounded-full border border-white/10 bg-white/5'>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${summary.score}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className='h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500'
            />
          </div>
        </div>

        {/* AI suggestion based on stats */}
        {summary.total > 0 && (
          <div className='mt-4 rounded-xl border border-indigo-400/15 bg-indigo-400/5 p-3 text-sm text-white/80 leading-relaxed'>
            <span className='font-semibold text-indigo-200'>🧠 AI Note: </span>
            {summary.overdue > 0
              ? `You have ${summary.overdue} overdue task${summary.overdue > 1 ? 's' : ''}. Consider re-prioritizing or breaking them down into smaller subtasks to regain momentum.`
              : summary.highPriority > 3
                ? `You have ${summary.highPriority} high-priority tasks. Focus on completing one at a time to avoid burnout.`
                : summary.done === summary.total
                  ? 'All tasks completed! Great work. Consider setting new goals to keep the momentum going.'
                  : `You're making progress with ${summary.done} of ${summary.total} tasks done. Keep up the momentum!`}
          </div>
        )}
      </div>
    </motion.div>
  )
}

