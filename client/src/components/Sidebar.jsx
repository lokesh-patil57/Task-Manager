import { motion } from 'framer-motion'
import { BarChart3, BrainCircuit, CalendarClock, KanbanSquare, LayoutDashboard, ListChecks, Sparkles, UserCircle } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const linkBase =
  'flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition border border-transparent hover:border-white/15 hover:bg-white/5'

const navItems = [
  { to: '/dashboard',    icon: <LayoutDashboard className='h-4 w-4 text-indigo-300' />, label: 'Dashboard' },
  { to: '/tasks',        icon: <KanbanSquare     className='h-4 w-4 text-indigo-300' />, label: 'Tasks' },
  { to: '/analytics',   icon: <BarChart3         className='h-4 w-4 text-indigo-300' />, label: 'Analytics' },
]

const aiItems = [
  { to: '/ai-planner',   icon: <CalendarClock className='h-4 w-4 text-purple-300' />, label: 'AI Planner' },
  { to: '/ai-breakdown', icon: <BrainCircuit  className='h-4 w-4 text-purple-300' />, label: 'AI Breakdown' },
  { to: '/ai-insights',  icon: <Sparkles      className='h-4 w-4 text-purple-300' />, label: 'AI Insights' },
]

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -12, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className='hidden lg:block'
    >
      <div className='glass-subtle mt-4 h-[calc(100vh-110px)] w-full p-3 flex flex-col gap-1 overflow-y-auto'>

        <div className='px-2 pb-1 text-xs text-white/60'>Workspace</div>
        <nav className='space-y-1'>
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `${linkBase} ${isActive ? 'bg-white/10 border-white/20' : ''}`}
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>

        <div className='mt-4 px-2 pb-1 text-xs text-white/60'>AI Features</div>
        <nav className='space-y-1'>
          {aiItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `${linkBase} ${isActive ? 'bg-white/10 border-white/20' : ''}`}
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>

        <div className='mt-4 px-2 pb-1 text-xs text-white/60'>Account</div>
        <nav className='space-y-1'>
          <NavLink
            to='/profile'
            className={({ isActive }) => `${linkBase} ${isActive ? 'bg-white/10 border-white/20' : ''}`}
          >
            <UserCircle className='h-4 w-4 text-white/50' />
            Profile
          </NavLink>
        </nav>

        <div className='mt-auto pt-4'>
          <div className='rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/55'>
            💡 Drag tasks across columns to update status. Use AI to auto-prioritize.
          </div>
        </div>
      </div>
    </motion.aside>
  )
}

