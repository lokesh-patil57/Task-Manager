import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppShell from './components/AppShell'
import { useAuth } from './context/AuthContext'

const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const OAuthSuccess = lazy(() => import('./pages/OAuthSuccess.jsx'))
const Home = lazy(() => import('./pages/Home.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Analytics = lazy(() => import('./pages/Analytics.jsx'))

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

function Protected({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to='/login' replace />
  return children
}

const App = () => {
  const { token } = useAuth()
  const location = useLocation()

  const isAuthed = Boolean(token)

  return (
    <AnimatePresence mode='wait'>
      <Suspense
        fallback={
          <div className='min-h-screen grid place-items-center px-4 bg-gradient-to-br from-black via-gray-900 to-black'>
            <div className='glass p-6 text-white/80'>Loading…</div>
          </div>
        }
      >
        <Routes location={location} key={location.pathname}>
          <Route path='/' element={<Navigate to={isAuthed ? '/home' : '/login'} replace />} />
          <Route
            path='/login'
            element={
              <Page>
                <Login />
              </Page>
            }
          />
          <Route
            path='/register'
            element={
              <Page>
                <Register />
              </Page>
            }
          />
          <Route
            path='/oauth-success'
            element={
              <Page>
                <OAuthSuccess />
              </Page>
            }
          />

          <Route
            path='/home'
            element={
              <Protected>
                <AppShell title='Home'>
                  <Page>
                    <Home />
                  </Page>
                </AppShell>
              </Protected>
            }
          />

          <Route
            path='/dashboard'
            element={
              <Protected>
                <AppShell title='Dashboard'>
                  <Page>
                    <Dashboard />
                  </Page>
                </AppShell>
              </Protected>
            }
          />
          <Route
            path='/analytics'
            element={
              <Protected>
                <AppShell title='Analytics'>
                  <Page>
                    <Analytics />
                  </Page>
                </AppShell>
              </Protected>
            }
          />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

export default App