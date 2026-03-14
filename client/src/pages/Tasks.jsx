import { RefreshCcw, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/axios'
import TaskBoard from '../components/TaskBoard'
import TaskFilters from '../components/TaskFilters'

const DEFAULT_FILTERS = { search: '', priority: 'all', status: 'all', deadline: 'all' }

function groupByStatus(tasks) {
  return tasks.reduce(
    (groups, task) => {
      if (task?.status && groups[task.status]) {
        groups[task.status].push(task)
      }
      return groups
    },
    { pending: [], 'in-progress': [], done: [] }
  )
}

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
  return tasks.filter((task) => {
    if (!task) return false
    if (filters.search && !task.title?.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false
    if (filters.status !== 'all' && task.status !== filters.status) return false
    if (filters.deadline !== 'all' && getDeadlineBucket(task.deadline) !== filters.deadline) return false
    return true
  })
}

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const filteredTasks = useMemo(() => applyFilters(tasks, filters), [tasks, filters])
  const tasksByStatus = useMemo(() => groupByStatus(filteredTasks), [filteredTasks])

  async function fetchTasks() {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/tasks')
      setTasks(Array.isArray(res.data?.tasks) ? res.data.tasks : [])
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  async function handleDeleteTask(task) {
    if (!task?._id) return
    try {
      await api.delete(`/tasks/${task._id}`)
      setTasks((current) => current.filter((item) => item._id !== task._id))
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete task')
    }
  }

  async function handleDragEnd(result) {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const nextStatus = destination.droppableId
    const previousTasks = tasks
    const optimisticTasks = tasks.map((task) =>
      task._id === draggableId ? { ...task, status: nextStatus } : task
    )
    setTasks(optimisticTasks)

    try {
      const res = await api.put(`/tasks/${draggableId}`, { status: nextStatus })
      setTasks((current) => current.map((task) => (task._id === draggableId ? res.data.task : task)))
    } catch (e) {
      setTasks(previousTasks)
      setError(e?.response?.data?.message || 'Failed to update task status')
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <div className='text-xs text-white/60'>Workspace</div>
          <div className='text-xl font-semibold tracking-tight'>All Tasks</div>
        </div>
        <button className='btn' onClick={fetchTasks} disabled={loading}>
          <RefreshCcw className='h-4 w-4' />
          Refresh
        </button>
      </div>

      <TaskFilters filters={filters} onChange={setFilters} />

      {error ? (
        <div className='rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200'>
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className='glass p-6 text-sm text-white/65'>Loading tasks…</div>
      ) : (
        <TaskBoard
          tasksByStatus={tasksByStatus}
          onDragEnd={handleDragEnd}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {!loading && filteredTasks.length === 0 ? (
        <div className='glass-subtle flex items-center gap-2 p-4 text-sm text-white/60'>
          <Trash2 className='h-4 w-4 text-white/35' />
          No tasks match the current filters.
        </div>
      ) : null}
    </div>
  )
}
