import { motion } from 'framer-motion'
import { Download, Plus, RefreshCcw, Rocket } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/axios'
import AIProductivityTip from '../components/AIProductivityTip'
import AISchedule from '../components/AISchedule'
import AISuggestions from '../components/AISuggestions'
import AITaskBreakdown from '../components/AITaskBreakdown'
import SkeletonCard from '../components/SkeletonCard'
import StatsCard from '../components/StatsCard'
import TaskBoard from '../components/TaskBoard'
import TaskFilters from '../components/TaskFilters'
import TaskModal from '../components/TaskModal'
import { exportTasksCSV } from '../utils/exportCSV'
import { infoToast, successToast, undoDeleteToast } from '../utils/toast'
import { useKeyboardShortcuts } from '../utils/useKeyboardShortcuts'

function groupByStatus(tasks) {
  const out = { pending: [], 'in-progress': [], done: [] }
  for (const t of tasks) {
    if (t) out[t.status]?.push(t)
  }
  return out
}

const DEFAULT_FILTERS = { search: '', priority: 'all', status: 'all', deadline: 'all' }

function getDeadlineBucket(deadline) {
  if (!deadline) return 'none'
  const date = new Date(deadline)
  if (Number.isNaN(date.getTime())) return 'none'
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
  if (date < todayStart) return 'overdue'
  if (date >= todayStart && date < todayEnd) return 'today'
  return 'upcoming'
}

function applyFilters(tasks, filters) {
  return tasks.filter((t) => {
    if (!t) return false
    if (
      filters.search &&
      !t.title?.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false
    if (filters.priority !== 'all' && t.priority !== filters.priority) return false
    if (filters.status !== 'all' && t.status !== filters.status) return false
    if (filters.deadline !== 'all' && getDeadlineBucket(t.deadline) !== filters.deadline)
      return false
    return true
  })
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create') // create | edit
  const [breakdownOpen, setBreakdownOpen] = useState(false)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const filteredTasks = useMemo(() => applyFilters(tasks, filters), [tasks, filters])
  const tasksByStatus = useMemo(() => groupByStatus(filteredTasks), [filteredTasks])

  const counts = useMemo(() => {
    const validTasks = tasks || []
    const total = validTasks.length
    const done = validTasks.filter((t) => t?.status === 'done').length
    const pending = validTasks.filter((t) => t?.status === 'pending').length
    const inProgress = validTasks.filter((t) => t?.status === 'in-progress').length
    const score = total ? done / total : 0
    return { total, done, pending, inProgress, score }
  }, [tasks])

  const fetchTasks = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/tasks')
      setTasks(res.data.tasks || [])
      if (res.data.tasks?.length && !selectedTask) setSelectedTask(res.data.tasks[0])
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openCreate = () => {
    setModalMode('create')
    setModalOpen(true)
  }

  const openEdit = () => {
    if (!selectedTask) return
    setModalMode('edit')
    setModalOpen(true)
  }

  // Feature 8: Keyboard shortcuts
  useKeyboardShortcuts({ onNew: openCreate })

  const saveTask = async (payload) => {
    try {
      if (modalMode === 'edit' && selectedTask?._id) {
        const res = await api.put(`/tasks/${selectedTask._id}`, payload)
        setTasks((prev) => prev.map((t) => (t._id === selectedTask._id ? res.data.task : t)))
        setSelectedTask(res.data.task)
        successToast('Task updated')
        return { ok: true }
      }

      const res = await api.post('/tasks', payload)
      console.log('CREATE TASK RESPONSE:', res.data.task)
      setTasks((prev) => [res.data.task, ...prev])
      setSelectedTask(res.data.task)
      successToast('Task created')
      return { ok: true }
    } catch (e) {
      const msg =
        e?.response?.data?.errors?.[0]?.message || e?.response?.data?.message || 'Save failed'
      return { ok: false, message: msg }
    }
  }

  // Feature 1: Undo Delete
  const deleteTask = async (task) => {
    try {
      await api.delete(`/tasks/${task._id}`)
      setTasks((prev) => prev.filter((t) => t._id !== task._id))
      if (selectedTask?._id === task._id) setSelectedTask(null)

      undoDeleteToast(async () => {
        try {
          // Strip _id and MongoDB-specific fields, recreate the task
          // eslint-disable-next-line no-unused-vars
          const { _id, __v, createdAt, updatedAt, ai, riskLevel, ...restTask } = task
          const res = await api.post('/tasks', restTask)
          setTasks((prev) => [res.data.task, ...prev])
          setSelectedTask(res.data.task)
          successToast('Task restored!')
        } catch {
          // silently fail
        }
      })
    } catch (e) {
      setError(e?.response?.data?.message || 'Delete failed')
    }
  }

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const newStatus = destination.droppableId
    const task = tasks.find((t) => t._id === draggableId)
    if (!task) return

    const prevTasks = tasks
    const updated = tasks.map((t) => (t._id === draggableId ? { ...t, status: newStatus } : t))
    setTasks(updated)

    try {
      const res = await api.put(`/tasks/${draggableId}`, { status: newStatus })
      setTasks((cur) => cur.map((t) => (t._id === draggableId ? res.data.task : t)))
      if (selectedTask?._id === draggableId) setSelectedTask(res.data.task)
    } catch (e) {
      setTasks(prevTasks)
      setError(e?.response?.data?.message || 'Failed to update status')
    }
  }

  if (loading) {
    return (
      <div className='space-y-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='space-y-1'>
            <SkeletonCard className='h-3 w-28' />
            <SkeletonCard className='h-4 w-40' />
          </div>
          <div className='flex items-center gap-2'>
            <SkeletonCard className='h-9 w-24' />
            <SkeletonCard className='h-9 w-28' />
            <SkeletonCard className='h-9 w-32' />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]'>
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <SkeletonCard className='h-24' />
              <SkeletonCard className='h-24' />
              <SkeletonCard className='h-24' />
            </div>
            <SkeletonCard className='h-[360px]' />
          </div>
          <div className='space-y-4'>
            <SkeletonCard className='h-[200px]' />
            <SkeletonCard className='h-[260px]' />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <div className='text-xs text-white/60'>Overview</div>
          <div className='text-xl font-semibold tracking-tight'>Your Kanban</div>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <button className='btn' onClick={fetchTasks}>
            <RefreshCcw className='h-4 w-4' />
            Refresh
          </button>
          <button className='btn btn-primary' onClick={openCreate} title='New Task (N)'>
            <Plus className='h-4 w-4' />
            New Task
            <span className='kbd-hint ml-1'>N</span>
          </button>
          <button className='btn' onClick={openEdit} disabled={!selectedTask}>
            Edit Selected
          </button>
          {/* Feature 7: Export CSV */}
          <button
            className='btn'
            onClick={() => {
              exportTasksCSV(tasks)
              successToast('Tasks exported to CSV!')
            }}
            disabled={!tasks.length}
            title='Export all tasks as CSV'
          >
            <Download className='h-4 w-4' />
            Export CSV
          </button>
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

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]'>
        <div className='space-y-4'>
          {/* Stats */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <StatsCard title='Total Tasks' value={counts.total} subtitle='Across all columns' />
            <StatsCard title='Completed' value={counts.done} subtitle='Done and shipped' />
            <StatsCard
              title='Productivity Score'
              value={`${Math.round(counts.score * 100)}%`}
              subtitle='Completed / total'
            />
          </div>

          {/* Feature 2: Search + Filters */}
          <TaskFilters filters={filters} onChange={setFilters} />

          {/* Kanban Board */}
          {tasks.length ? (
            filteredTasks.length ? (
              <TaskBoard
                tasksByStatus={tasksByStatus}
                onDragEnd={onDragEnd}
                onSelectTask={setSelectedTask}
                onDeleteTask={deleteTask}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='glass p-6 text-center text-sm text-white/60'
              >
                No tasks match your current filters.{' '}
                <button
                  className='text-indigo-300 hover:underline'
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                >
                  Clear filters
                </button>
              </motion.div>
            )
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className='glass p-6'
            >
              <div className='flex flex-col items-center justify-center gap-3 py-10 text-center'>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className='grid h-14 w-14 place-items-center rounded-3xl border border-white/15 bg-white/10'
                >
                  <Rocket className='h-6 w-6 text-indigo-300' />
                </motion.div>
                <div>
                  <div className='text-lg font-semibold'>🚀 No tasks yet</div>
                  <div className='mt-1 text-sm text-white/70'>
                    Create your first task to start boosting productivity.
                  </div>
                </div>
                <div className='mt-2 flex items-center gap-2'>
                  <button
                    className='btn btn-primary'
                    onClick={() => {
                      infoToast('Start by creating a task!')
                      openCreate()
                    }}
                  >
                    <Plus className='h-4 w-4' />
                    Create your first task
                  </button>
                  <button className='btn' onClick={fetchTasks}>
                    <RefreshCcw className='h-4 w-4' />
                    Refresh
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right panel */}
        <div className='space-y-4'>
          {/* Feature 6: AI Productivity Tip */}
          <AIProductivityTip tasks={tasks} />

          <AISchedule />
          <AISuggestions task={selectedTask} />

          {/* Selected Task details */}
          <div className='glass p-4'>
            <div className='flex items-center justify-between gap-3'>
              <div className='text-sm font-semibold'>Selected Task</div>
              <button className='btn !px-3' onClick={() => setBreakdownOpen(true)} disabled={!selectedTask}>
                AI Breakdown
              </button>
            </div>
            {selectedTask ? (
              <div className='mt-2 text-sm text-white/75'>
                <div className='font-semibold text-white'>{selectedTask.title}</div>
                <div className='mt-1 text-white/65'>{selectedTask.description || 'No description'}</div>

                {selectedTask.riskLevel ? (
                  <div className='mt-3 rounded-xl border border-white/10 bg-white/5 p-3'>
                    <div className='flex items-center justify-between gap-3'>
                      <div className='text-xs text-white/60'>⚠ Deadline Risk</div>
                      <div
                        className={`badge ${selectedTask.riskLevel === 'high'
                          ? 'bg-red-500/15 border-red-400/30 text-red-100'
                          : selectedTask.riskLevel === 'medium'
                            ? 'bg-amber-500/15 border-amber-300/30 text-amber-100'
                            : 'bg-emerald-500/15 border-emerald-300/30 text-emerald-100'
                          }`}
                      >
                        {String(selectedTask.riskLevel).toUpperCase()}
                      </div>
                    </div>
                    {selectedTask.ai?.riskSuggestion ? (
                      <div className='mt-2 text-sm text-white/75'>{selectedTask.ai.riskSuggestion}</div>
                    ) : (
                      <div className='mt-2 text-sm text-white/60'>Tip: add an estimated time for better risk detection.</div>
                    )}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className='mt-2 text-sm text-white/60'>Click a task card to see details.</div>
            )}
          </div>

          {/* Keyboard shortcuts hint */}
          <div className='glass-subtle p-3'>
            <div className='text-xs text-white/50 font-semibold mb-2'>⌨ Keyboard Shortcuts</div>
            <div className='grid grid-cols-3 gap-1'>
              {[
                { key: 'N', label: 'New Task' },
                { key: 'D', label: 'Dashboard' },
                { key: 'A', label: 'Analytics' },
              ].map(({ key, label }) => (
                <div key={key} className='flex flex-col items-center gap-1'>
                  <span className='kbd-hint text-xs'>{key}</span>
                  <span className='text-[10px] text-white/40'>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TaskModal
        open={modalOpen}
        mode={modalMode}
        initialTask={modalMode === 'edit' ? selectedTask : null}
        onClose={() => setModalOpen(false)}
        onSave={saveTask}
      />

      <AITaskBreakdown
        open={breakdownOpen}
        title={selectedTask?.title || ''}
        onClose={() => setBreakdownOpen(false)}
      />
    </div>
  )
}
