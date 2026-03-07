import { useEffect, useState } from 'react'
import { api } from '../api/axios'
import ProductivityInsights from '../components/ProductivityInsights'
import SkeletonCard from '../components/SkeletonCard'

export default function Analytics() {
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
        setError(e?.response?.data?.message || 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

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
    <div className='space-y-4'>
      <div>
        <div className='text-xs text-white/60'>Insights</div>
        <div className='text-xl font-semibold tracking-tight'>Analytics</div>
      </div>

      {error ? (
        <div className='glass-subtle border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200'>
          {error}
        </div>
      ) : null}

      <ProductivityInsights tasks={tasks} />
    </div>
  )
}

