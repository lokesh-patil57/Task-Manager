import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OAuthSuccess() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setTokenFromOAuth } = useAuth()

  useEffect(() => {
    const token = params.get('token')
    if (token) {
      setTokenFromOAuth(token)
      navigate('/dashboard', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }, [params, navigate, setTokenFromOAuth])

  return (
    <div className='min-h-screen grid place-items-center px-4'>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='glass p-6'>
        Signing you in…
      </motion.div>
    </div>
  )
}

