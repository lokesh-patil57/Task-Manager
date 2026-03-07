import { motion } from 'framer-motion'
import { LogOut, Moon, Sparkles, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar({ title = 'Dashboard' }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className='sticky top-0 z-30'>
      <div className='w-full px-4 pt-4'>
        <div className='glass flex items-center justify-between px-4 py-3'>
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex items-center gap-3'
          >
            <div className='grid h-10 w-10 place-items-center rounded-2xl border border-white/20 bg-white/10'>
              <Sparkles className='h-5 w-5 text-indigo-300' />
            </div>
            <div>
              <div className='text-sm text-white/70'>AI Smart Task Manager</div>
              <div className='text-lg font-semibold tracking-tight'>{title}</div>
            </div>
          </motion.div>

          <div className='flex items-center gap-3'>
            <div className='hidden sm:block text-right'>
              <div className='text-xs text-white/60'>Signed in</div>
              <div className='text-sm'>{user?.email || '—'}</div>
            </div>



            <button className='btn' onClick={logout}>
              <LogOut className='h-4 w-4' />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
