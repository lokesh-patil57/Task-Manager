import { motion } from 'framer-motion'
import { AlertTriangle, Calendar, Clock, Trash2 } from 'lucide-react'
import { memo } from 'react'

// Priority → solid color badge with glow
function priorityBadgeStyle(priority) {
  if (priority === 'high')
    return 'bg-red-500 border-red-400/60 text-white shadow-[0_0_10px_2px_rgba(239,68,68,0.4)]'
  if (priority === 'medium')
    return 'bg-yellow-500 border-yellow-400/60 text-white shadow-[0_0_10px_2px_rgba(234,179,8,0.4)]'
  return 'bg-green-500 border-green-400/60 text-white shadow-[0_0_10px_2px_rgba(34,197,94,0.4)]'
}

function riskColor(riskLevel) {
  if (riskLevel === 'high') return 'bg-red-500/15 border-red-400/30 text-red-100'
  if (riskLevel === 'medium') return 'bg-amber-500/15 border-amber-300/30 text-amber-100'
  if (riskLevel === 'low') return 'bg-emerald-500/15 border-emerald-300/30 text-emerald-100'
  return 'bg-white/5 border-white/10 text-white/65'
}

function formatDate(d) {
  if (!d) return null
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

/**
 * Returns 'overdue', 'today', or null based on deadline.
 */
function getDeadlineStatus(deadline) {
  if (!deadline) return null
  const date = new Date(deadline)
  if (Number.isNaN(date.getTime())) return null
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
  if (date < todayStart) return 'overdue'
  if (date >= todayStart && date < todayEnd) return 'today'
  return null
}

function TaskCard({ task, onClick, onDelete }) {
  const date = formatDate(task.deadline)
  const deadlineStatus = task.status !== 'done' ? getDeadlineStatus(task.deadline) : null

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.14 }}
      className='glass-subtle cursor-pointer p-3 transition-shadow hover:shadow-[0_18px_55px_rgba(0,0,0,0.6)]'
      onClick={onClick}
    >
      <div className='flex items-start justify-between gap-2'>
        <div className='min-w-0'>
          <div className='truncate text-sm font-semibold'>{task.title}</div>
          {task.description ? (
            <div className='mt-1 line-clamp-2 text-xs text-white/70'>{task.description}</div>
          ) : (
            <div className='mt-1 text-xs text-white/40'>No description</div>
          )}
        </div>
        <button
          className='btn !p-2'
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.()
          }}
          title='Delete task'
        >
          <Trash2 className='h-4 w-4 text-white/70' />
        </button>
      </div>

      <div className='mt-3 flex items-center justify-between gap-2 flex-wrap'>
        <div className='flex items-center gap-2 flex-wrap'>
          {/* Priority badge with glow */}
          <span className={`badge text-xs font-semibold capitalize ${priorityBadgeStyle(task.priority)}`}>
            {task.priority}
          </span>

          {task.riskLevel ? (
            <span className={`badge ${riskColor(task.riskLevel)}`}>
              <span className='inline-flex items-center gap-1'>
                <AlertTriangle className='h-3.5 w-3.5' />
                {task.riskLevel}
              </span>
            </span>
          ) : null}

          {/* Deadline warning badges */}
          {deadlineStatus === 'overdue' && (
            <span className='badge bg-red-600/90 border-red-500/60 text-white text-xs font-semibold animate-pulse-slow'>
              ⛔ Overdue
            </span>
          )}
          {deadlineStatus === 'today' && (
            <span className='badge bg-amber-500/90 border-amber-400/60 text-white text-xs font-semibold'>
              ⚠ Due Today
            </span>
          )}
        </div>

        {date ? (
          <span className='inline-flex items-center gap-1 text-xs text-white/60'>
            <Calendar className='h-3.5 w-3.5' /> {date}
          </span>
        ) : (
          <span className='inline-flex items-center gap-1 text-xs text-white/35'>
            <Clock className='h-3 w-3' /> No deadline
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default memo(TaskCard)
