import { motion } from 'framer-motion'
import { BarChart3, Home, LayoutDashboard } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const linkBase =
  'flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition border border-transparent hover:border-white/15 hover:bg-white/5'

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -12, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className='hidden lg:block'
    >
      <div className='glass-subtle mt-4 h-[calc(100vh-110px)] w-full p-3'>
        <div className='px-2 pb-2 text-xs text-white/60'>Workspace</div>
        <nav className='space-y-1'>
          <NavLink
            to='/home'
            className={({ isActive }) => `${linkBase} ${isActive ? 'bg-white/10 border-white/20' : ''}`}
          >
            <Home className='h-4 w-4 text-indigo-300' />
            Home
          </NavLink>
          <NavLink
            to='/dashboard'
            className={({ isActive }) => `${linkBase} ${isActive ? 'bg-white/10 border-white/20' : ''}`}
          >
            <LayoutDashboard className='h-4 w-4 text-indigo-300' />
            Dashboard
          </NavLink>
          <NavLink
            to='/analytics'
            className={({ isActive }) => `${linkBase} ${isActive ? 'bg-white/10 border-white/20' : ''}`}
          >
            <BarChart3 className='h-4 w-4 text-indigo-300' />
            Analytics
          </NavLink>
        </nav>

        <div className='mt-6 px-2 pb-2 text-xs text-white/60'>Tips</div>
        <div className='rounded-xl border border-white/15 bg-white/5 p-3 text-sm text-white/75'>
          Drag tasks across columns to update status. Use AI suggestions to auto-prioritize and estimate time.
        </div>
      </div>
    </motion.aside>
  )
}

