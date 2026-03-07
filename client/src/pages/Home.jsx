import { motion } from 'framer-motion'
import { ArrowRight, Brain, CalendarClock, KanbanSquare, LineChart, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: <KanbanSquare className='h-4 w-4 text-indigo-200' />,
    title: 'Kanban board',
    desc: 'Drag & drop tasks across columns with a clean workflow.',
  },
  {
    icon: <Brain className='h-4 w-4 text-indigo-200' />,
    title: 'AI priority + estimates',
    desc: 'Gemini suggests priority, time, and helpful hints automatically.',
  },
  {
    icon: <CalendarClock className='h-4 w-4 text-indigo-200' />,
    title: 'AI daily scheduler',
    desc: 'Turn your task list into an optimized daily plan in one click.',
  },
  {
    icon: <LineChart className='h-4 w-4 text-indigo-200' />,
    title: 'Analytics & insights',
    desc: 'Track completion, productivity score, and priority distribution.',
  },
  {
    icon: <ShieldCheck className='h-4 w-4 text-indigo-200' />,
    title: 'Secure auth',
    desc: 'JWT authentication with optional Google OAuth login.',
  },
]

export default function Home() {
  return (
    <div className='space-y-6'>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className='glass p-6'
      >
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='max-w-2xl'>
            <div className='text-xs text-white/60'>Welcome to</div>
            <div className='mt-1 text-2xl font-semibold tracking-tight'>AI Smart Task Manager</div>
            <div className='mt-2 text-sm text-white/70'>
              A modern AI-powered productivity SaaS experience: plan your day, manage tasks on a Kanban board, and
              measure your momentum with analytics.
            </div>
            <div className='mt-5 flex flex-wrap items-center gap-2'>
              <Link to='/dashboard' className='btn btn-primary'>
                Open Dashboard <ArrowRight className='h-4 w-4' />
              </Link>
              <Link to='/analytics' className='btn'>
                View Analytics
              </Link>
            </div>
          </div>

          <div className='glass-subtle w-full max-w-sm p-4'>
            <div className='flex items-center gap-2'>
              <div className='grid h-10 w-10 place-items-center rounded-2xl border border-white/20 bg-white/10'>
                <Sparkles className='h-5 w-5 text-indigo-300' />
              </div>
              <div>
                <div className='text-sm font-semibold'>Quick start</div>
                <div className='text-xs text-white/60'>Best workflow in 3 steps</div>
              </div>
            </div>
            <ol className='mt-4 space-y-2 text-sm text-white/75'>
              <li className='flex gap-2'>
                <span className='badge bg-white/5 border-white/10 text-white/70'>1</span>
                Create tasks (AI auto-suggests priority & time)
              </li>
              <li className='flex gap-2'>
                <span className='badge bg-white/5 border-white/10 text-white/70'>2</span>
                Drag tasks across Kanban columns as you work
              </li>
              <li className='flex gap-2'>
                <span className='badge bg-white/5 border-white/10 text-white/70'>3</span>
                Generate your AI daily schedule and review analytics
              </li>
            </ol>
          </div>
        </div>
      </motion.div>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-3'>
        {features.map((f) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className='glass-subtle p-5'
          >
            <div className='flex items-start gap-3'>
              <div className='grid h-9 w-9 place-items-center rounded-2xl border border-white/15 bg-white/10'>
                {f.icon}
              </div>
              <div>
                <div className='text-sm font-semibold'>{f.title}</div>
                <div className='mt-1 text-sm text-white/70'>{f.desc}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

