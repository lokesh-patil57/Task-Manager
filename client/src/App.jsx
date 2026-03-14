import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppShell from './components/AppShell'
import { useAuth } from './context/AuthContext'

function OAuthTokenBridge() {
  const location = useLocation()
  const { setTokenFromOAuth } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    if (!token) return

    setTokenFromOAuth(token)

    params.delete('token')
    const nextSearch = params.toString()
    const nextUrl = `${location.pathname}${nextSearch ? `?${nextSearch}` : ''}${location.hash || ''}`
    window.history.replaceState({}, '', nextUrl)
  }, [location.hash, location.pathname, location.search, setTokenFromOAuth])

  return null
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, initialized } = useAuth()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const hasOauthToken = Boolean(params.get('token'))
  if (!initialized) {
    return (
      <div className='min-h-screen grid place-items-center'>
        <div className='glass p-6 text-white/70'>Authenticating…</div>
      </div>
    )
  }
  if (!isAuthenticated && !hasOauthToken) {
    return <Navigate to='/login' replace state={{ from: location }} />
  }
  return children
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, initialized } = useAuth()
  if (!initialized) return null
  if (isAuthenticated) return <Navigate to='/dashboard' replace />
  return children
}

const Home         = lazy(() => import('./pages/Home.jsx'))
const Login        = lazy(() => import('./pages/Login.jsx'))
const Register     = lazy(() => import('./pages/Register.jsx'))
const OAuthSuccess = lazy(() => import('./pages/OAuthSuccess.jsx'))
const Dashboard    = lazy(() => import('./pages/Dashboard.jsx'))
const Tasks        = lazy(() => import('./pages/Tasks.jsx'))
const Analytics    = lazy(() => import('./pages/Analytics.jsx'))
const Profile      = lazy(() => import('./pages/Profile.jsx'))
const AIPlanner    = lazy(() => import('./pages/AIPlanner.jsx'))
const AIBreakdown  = lazy(() => import('./pages/AIBreakdown.jsx'))
const AIInsights   = lazy(() => import('./pages/AIInsights.jsx'))

function Page({ children }) {
  const location = useLocation()
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.div>
  )
}

const PAGE_TITLES = {
  '/':              'AI Productivity Platform',
  '/login':         'Login',
  '/register':      'Create Account',
  '/oauth-success': 'OAuth Success',
  '/dashboard':     'Dashboard',
  '/tasks':         'Tasks',
  '/analytics':     'Analytics',
  '/profile':       'Profile',
  '/ai-planner':    'AI Planner',
  '/ai-breakdown':  'AI Breakdown',
  '/ai-insights':   'AI Insights',
}

const App = () => {
  const location = useLocation()

  useEffect(() => {
    document.title = `TaskFlow | ${PAGE_TITLES[location.pathname] ?? 'App'}`
  }, [location.pathname])

  return (
    <AnimatePresence mode='wait'>
      <Suspense
        fallback={
          <div className='min-h-screen grid place-items-center px-4 bg-linear-to-br from-black via-gray-900 to-black'>
            <div className='glass p-6 text-white/80'>Loading…</div>
          </div>
        }
      >
        <OAuthTokenBridge />
        <Routes location={location} key={location.pathname}>

          <Route path='/' element={<Page><Home /></Page>} />

          <Route path='/login' element={
            <PublicOnlyRoute><Page><Login /></Page></PublicOnlyRoute>
          } />

          <Route path='/register' element={
            <PublicOnlyRoute><Page><Register /></Page></PublicOnlyRoute>
          } />

          <Route path='/oauth-success' element={<Page><OAuthSuccess /></Page>} />
          <Route path='/home' element={<Navigate to='/dashboard' replace />} />

          <Route path='/dashboard' element={
            <ProtectedRoute>
              <AppShell title='Dashboard'><Page><Dashboard /></Page></AppShell>
            </ProtectedRoute>
          } />

          <Route path='/tasks' element={
            <ProtectedRoute>
              <AppShell title='Tasks'><Page><Tasks /></Page></AppShell>
            </ProtectedRoute>
          } />

          <Route path='/analytics' element={
            <ProtectedRoute>
              <AppShell title='Analytics'><Page><Analytics /></Page></AppShell>
            </ProtectedRoute>
          } />

          <Route path='/profile' element={
            <ProtectedRoute>
              <AppShell title='Profile'><Page><Profile /></Page></AppShell>
            </ProtectedRoute>
          } />

          <Route path='/ai-planner' element={
            <ProtectedRoute>
              <AppShell title='AI Planner'><Page><AIPlanner /></Page></AppShell>
            </ProtectedRoute>
          } />

          <Route path='/ai-breakdown' element={
            <ProtectedRoute>
              <AppShell title='AI Breakdown'><Page><AIBreakdown /></Page></AppShell>
            </ProtectedRoute>
          } />

          <Route path='/ai-insights' element={
            <ProtectedRoute>
              <AppShell title='AI Insights'><Page><AIInsights /></Page></AppShell>
            </ProtectedRoute>
          } />

          <Route path='*' element={<Navigate to='/' replace />} />

        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

export default App
