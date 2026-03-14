import { motion } from 'framer-motion'
import { Chrome, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import LoadingButton from '../components/LoadingButton'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const apiUrl = import.meta.env.VITE_API_URL
  const frontendOrigin = typeof window !== 'undefined' ? window.location.origin : ''
  const googleBase = import.meta.env.DEV ? '/api/auth/google' : apiUrl ? `${apiUrl}/api/auth/google` : '/api/auth/google'
  const googleHref = `${googleBase}?redirect=${encodeURIComponent(frontendOrigin)}`
  const oauthFailed = searchParams.get('oauth') === 'failed'

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await login({ email, password })
    if (!res.ok) return setError(res.message)
    navigate('/dashboard')
  }

  return (
    <div className='min-h-screen grid place-items-center px-4'>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className='glass w-full max-w-md p-6'
      >
        <div className='mb-5'>
          <div className='text-xs text-white/60'>Welcome back</div>
          <div className='text-2xl font-semibold tracking-tight'>Sign in</div>
          <div className='mt-1 text-sm text-white/70'>
            AI-powered productivity, built like a modern SaaS.
          </div>
        </div>

        {oauthFailed ? (
          <div className='mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100'>
            Google sign-in was cancelled or failed. Please try again.
          </div>
        ) : null}

        <a className='btn w-full justify-center' href={googleHref}>
          <Chrome className='h-4 w-4' />
          Continue with Google
        </a>

        <div className='my-4 flex items-center gap-3 text-xs text-white/50'>
          <div className='h-px flex-1 bg-white/10' />
          or
          <div className='h-px flex-1 bg-white/10' />
        </div>

        <form onSubmit={onSubmit} className='space-y-3'>
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
                placeholder='••••••••'
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
            text='Sign in'
            loadingText='Signing in…'
          />
        </form>

        <div className='mt-4 text-sm text-white/70'>
          New here?{' '}
          <Link to='/register' className='text-indigo-300 hover:text-indigo-200'>
            Create an account
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

