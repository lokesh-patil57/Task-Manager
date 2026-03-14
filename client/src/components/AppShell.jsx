import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function AppShell({ title, children }) {
  return (
    <div className='min-h-screen w-full bg-linear-to-br from-black via-gray-900 to-black flex flex-col'>
      <Navbar title={title} />
      <div className='flex-1 w-full px-4 pt-4'>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]'>
          <Sidebar />
          <div className='min-w-0 pb-10'>{children}</div>
        </div>
      </div>
      <footer className='px-4 pb-6 pt-4 text-sm text-white/50'>
        <div className='glass flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
          <span>© 2026 TaskFlow</span>
          <div className='flex items-center gap-4'>
            <a
              href='https://github.com/lokesh-patil57/Task-Manager'
              target='_blank'
              rel='noreferrer'
              className='hover:text-indigo-300 transition-colors'
            >
              GitHub
            </a>
            <a
              href='https://github.com/lokesh-patil57/Task-Manager#readme'
              target='_blank'
              rel='noreferrer'
              className='hover:text-indigo-300 transition-colors'
            >
              Documentation
            </a>
            <a href='mailto:contact@taskflow.app' className='hover:text-indigo-300 transition-colors'>
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

