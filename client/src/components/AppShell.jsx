import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function AppShell({ title, children }) {
  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black'>
      <Navbar title={title} />
      <div className='w-full px-4 pb-10 pt-4'>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]'>
          <Sidebar />
          <div className='min-w-0'>{children}</div>
        </div>
      </div>
    </div>
  )
}

