import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Workflow, Zap, BarChart3, BrainCircuit, CalendarClock, ArrowRight, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const features = [
  {
    icon: <Zap className="h-6 w-6 text-yellow-300" />,
    title: 'AI Task Prioritization',
    desc: 'Let the AI rank your tasks by urgency, deadlines, and workload — so you always know what to tackle next.',
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-indigo-300" />,
    title: 'Productivity Analytics',
    desc: 'Visual dashboards show completion rates, velocity trends, and your busiest hours at a glance.',
  },
  {
    icon: <BrainCircuit className="h-6 w-6 text-purple-300" />,
    title: 'AI Smart Breakdown',
    desc: 'Paste any big goal and watch TaskFlow split it into actionable subtasks with time estimates.',
  },
  {
    icon: <CalendarClock className="h-6 w-6 text-green-300" />,
    title: 'AI Schedule Planner',
    desc: 'Generates a personalised daily schedule that respects your existing commitments and energy levels.',
  },
]

export default function Home() {
  const { demoLogin, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [demoLoading, setDemoLoading] = useState(false)

  async function handleDemo() {
    setDemoLoading(true)
    try {
      await demoLogin()
      navigate('/dashboard')
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-black via-gray-900 to-black text-white">

      {/* ── Public Navbar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-30 w-full px-4 pt-4">
        <div className="glass flex items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-400 hover:text-indigo-300 transition-colors">
            <Workflow className="h-5 w-5" />
            TaskFlow
          </Link>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pt-28 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300 mb-6">
            <Zap className="h-3.5 w-3.5" /> AI-powered task management
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Manage work smarter with{' '}
            <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/65 mb-10">
            The all-in-one productivity platform that uses AI to prioritize, plan, and break down your tasks — so you can focus on what actually matters.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn btn-primary gap-2 text-base px-6 py-3">
              Get Started Free <ChevronRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="btn gap-2 text-base px-6 py-3">
              Login
            </Link>
            <button
              onClick={handleDemo}
              disabled={demoLoading}
              className="btn gap-2 text-base px-6 py-3 border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 disabled:opacity-60"
            >
              {demoLoading ? 'Loading…' : '✨ Try Demo'}
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-28">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-3xl font-bold mb-12">
            Everything you need to{' '}
            <span className="text-indigo-400">stay in flow</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="glass-subtle rounded-2xl border border-white/10 p-6 hover:border-indigo-500/30 transition-colors"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5">
                  {icon}
                </div>
                <h3 className="text-lg font-semibold mb-1">{title}</h3>
                <p className="text-sm text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-28">
        <div className="glass rounded-3xl border border-indigo-500/25 px-8 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to boost your productivity?</h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">
            Join thousands of users who ship more by working smarter — not harder.
          </p>
          <Link to="/register" className="btn btn-primary gap-2 text-base px-8 py-3">
            Start for Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-white/10 px-6 py-8 text-sm text-white/50">
        <div className="mx-auto max-w-5xl flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Workflow className="h-4 w-4 text-indigo-400" />
            <span className="font-semibold text-indigo-400">TaskFlow</span>
            <span className="ml-2">© 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/lokesh-patil57/Task-Manager" target="_blank" rel="noreferrer" className="hover:text-indigo-300 transition-colors">GitHub</a>
            <a href="https://github.com/lokesh-patil57/Task-Manager#readme" target="_blank" rel="noreferrer" className="hover:text-indigo-300 transition-colors">Documentation</a>
            <a href="mailto:contact@taskflow.app" className="hover:text-indigo-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
