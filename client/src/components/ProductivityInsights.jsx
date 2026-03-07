import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function clamp01(x) {
  return Math.max(0, Math.min(1, x))
}

function toDayKey(d) {
  const dt = new Date(d)
  if (Number.isNaN(dt.getTime())) return null
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function ProductivityInsights({ tasks }) {
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === 'done').length
    const score = total ? completed / total : 0
    return { total, completed, score }
  }, [tasks])

  const scorePct = Math.round(clamp01(stats.score) * 100)

  const weeklyCompletion = useMemo(() => {
    const map = new Map()
    for (const t of tasks) {
      if (t.status !== 'done') continue
      const key = toDayKey(t.updatedAt || t.createdAt)
      if (!key) continue
      map.set(key, (map.get(key) || 0) + 1)
    }
    const points = Array.from(map.entries()).map(([day, completed]) => ({ day, completed }))
    return points.slice(-7)
  }, [tasks])

  const priorityDistribution = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0 }
    for (const t of tasks) counts[t.priority] = (counts[t.priority] || 0) + 1
    return [
      { name: 'High', value: counts.high, fill: 'rgba(239,68,68,0.75)' },
      { name: 'Medium', value: counts.medium, fill: 'rgba(251,191,36,0.65)' },
      { name: 'Low', value: counts.low, fill: 'rgba(34,197,94,0.65)' },
    ]
  }, [tasks])

  const statusBars = useMemo(() => {
    const pending = tasks.filter((t) => t.status === 'pending').length
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length
    const done = tasks.filter((t) => t.status === 'done').length
    return [
      { name: 'Pending', value: pending },
      { name: 'In Progress', value: inProgress },
      { name: 'Completed', value: done },
    ]
  }, [tasks])

  return (
    <div className='space-y-4'>
      <div className='glass p-4'>
        <div className='text-sm font-semibold'>Daily Productivity Score</div>
        <div className='mt-2 text-xs text-white/60'>(completed tasks / total tasks) * 100</div>

        <div className='mt-4'>
          <div className='flex items-center justify-between text-sm'>
            <div className='text-white/70'>Score</div>
            <div className='font-semibold'>{scorePct}%</div>
          </div>
          <div className='mt-2 h-3 overflow-hidden rounded-full border border-white/10 bg-white/5'>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scorePct}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className='h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500'
            />
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-3'>
        <div className='glass p-4 xl:col-span-2'>
          <div className='text-sm font-semibold'>Weekly Completion</div>
          <div className='mt-3 h-[260px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={weeklyCompletion}>
                <CartesianGrid stroke='rgba(255,255,255,0.08)' />
                <XAxis dataKey='day' stroke='rgba(255,255,255,0.55)' />
                <YAxis stroke='rgba(255,255,255,0.55)' allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(0,0,0,0.85)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 12,
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type='monotone' dataKey='completed' stroke='rgba(99,102,241,0.95)' strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className='mt-2 text-xs text-white/60'>Completed tasks per day (recent)</div>
        </div>

        <div className='space-y-4'>
          <div className='glass p-4'>
            <div className='text-sm font-semibold'>Task Priority Distribution</div>
            <div className='mt-3 h-[220px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(0,0,0,0.85)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 12,
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Pie
                    data={priorityDistribution}
                    dataKey='value'
                    nameKey='name'
                    innerRadius={52}
                    outerRadius={82}
                    paddingAngle={2}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='mt-2 text-xs text-white/60'>High / Medium / Low</div>
          </div>

          <div className='glass p-4'>
            <div className='text-sm font-semibold'>Task Status</div>
            <div className='mt-3 h-[220px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={statusBars}>
                  <CartesianGrid stroke='rgba(255,255,255,0.08)' />
                  <XAxis dataKey='name' stroke='rgba(255,255,255,0.55)' />
                  <YAxis stroke='rgba(255,255,255,0.55)' allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(0,0,0,0.85)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 12,
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey='value' fill='rgba(168,85,247,0.75)' radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className='mt-2 text-xs text-white/60'>Pending / In progress / Done</div>
          </div>
        </div>
      </div>
    </div>
  )
}

