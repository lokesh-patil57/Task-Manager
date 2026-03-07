import { motion } from 'framer-motion'
import { Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingButton from '../components/LoadingButton'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await register({ name, email, password })
    if (!res.ok) return setError(res.message)
    navigate('/home')
  }

  return (
    <div className='min-h-screen grid place-items-center px-4'>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className='glass w-full max-w-md p-6'
      >
        <div className='mb-5'>
          <div className='text-xs text-white/60'>Start building momentum</div>
          <div className='text-2xl font-semibold tracking-tight'>Create account</div>
          <div className='mt-1 text-sm text-white/70'>
            Your tasks, your board, and AI-generated prioritization.
          </div>
        </div>

        <form onSubmit={onSubmit} className='space-y-3'>
          <label className='block'>
            <div className='mb-1 text-xs text-white/60'>Name</div>
            <div className='relative'>
              <User className='absolute left-3 top-3 h-4 w-4 text-white/40' />
              <input
                className='input pl-9'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Mohit'
                type='text'
              />
            </div>
          </label>
          <label className='block'>
            <div className='mb-1 text-xs text-white/60'>Email</div>
            <div className='relative'>
              <Mail className='absolute left-3 top-3 h-4 w-4 text-white/40' />
              <input
                className='input pl-9'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='you@company.com'
                type='email'
                required
              />
            </div>
          </label>
          <label className='block'>
            <div className='mb-1 text-xs text-white/60'>Password</div>
            <div className='relative'>
              <Lock className='absolute left-3 top-3 h-4 w-4 text-white/40' />
              <input
                className='input pl-9'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='min 6 characters'
                type='password'
                required
              />
            </div>
          </label>

          {error ? (
            <div className='rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200'>
              {error}
            </div>
          ) : null}

          <LoadingButton
            type='submit'
            className='w-full justify-center'
            isLoading={loading}
            text='Create account'
            loadingText='Creating…'
          />
        </form>

        <div className='mt-4 text-sm text-white/70'>
          Already have an account?{' '}
          <Link to='/login' className='text-indigo-300 hover:text-indigo-200'>
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

