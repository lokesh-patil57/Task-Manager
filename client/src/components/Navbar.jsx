import { motion } from 'framer-motion'
import { LogOut, User, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ title = 'Dashboard' }) {
  const { user, logout } = useAuth()

  return (
    <div className='sticky top-0 z-30'>
      <div className='w-full px-4 pt-4'>
        <div className='glass flex items-center justify-between px-4 py-3'>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex items-center gap-3'
          >
            <Link to='/dashboard' className='flex items-center gap-2 font-bold text-xl text-indigo-400 hover:text-indigo-300 transition-colors'>
              <Workflow className='h-5 w-5' />
              <span>TaskFlow</span>
            </Link>
            <div className='hidden sm:block h-5 w-px bg-white/20' />
            <div className='hidden sm:block text-sm font-medium text-white/60'>{title}</div>
          </motion.div>

          {/* Right side */}
          <div className='flex items-center gap-3'>
            <div className='hidden sm:flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5'>
              <User className='h-3.5 w-3.5 text-white/50' />
              <span className='text-xs text-white/70'>{user?.name || user?.email || '—'}</span>
            </div>
            <button
              className='btn'
              onClick={logout}
              title='Logout'
            >
              <LogOut className='h-4 w-4' />
              <span className='hidden sm:inline'>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
