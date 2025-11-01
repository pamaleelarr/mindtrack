import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Heart, Menu, LogOut, Trophy, Settings, Pill, LayoutDashboard, HeartPulse, Sparkles } from 'lucide-react'

export default function Layout({ children }) {
  const location = useLocation()
  const [user, setUser] = React.useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const navigationItems = [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'Add Entry', url: '/add-entry', icon: HeartPulse },
    { title: 'Achievements', url: '/achievements', icon: Trophy },
    { title: 'Strategies', url: '/strategies', icon: Sparkles },
    { title: 'Medication', url: '/medication', icon: Pill },
    { title: 'Settings', url: '/settings', icon: Settings },
  ]

  return (
    <div className='flex h-screen bg-gray-50'>
      <aside className='hidden md:flex w-64 bg-white border-r border-gray-200 flex-col'>
        <div className='flex items-center gap-3 p-6 border-b border-gray-200'>
          <Heart className='w-6 h-6 text-blue-600' />
          <span className='font-bold text-xl text-blue-600'>MindTrack</span>
        </div>
        
        <nav className='flex-1 py-4'>
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={\lex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-50 \\}
            >
              <item.icon className='w-5 h-5' />
              {item.title}
            </Link>
          ))}
        </nav>
        
        <div className='p-4 border-t border-gray-200'>
          {user && (
            <div className='flex items-center gap-3 p-2'>
              <div className='w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm'>
                {user.email?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className='flex-grow min-w-0'>
                <p className='font-semibold text-sm truncate'>{user.email}</p>
              </div>
              <button onClick={handleLogout} className='p-2 hover:bg-gray-100 rounded'>
                <LogOut className='w-4 h-4 text-gray-600' />
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className='flex-1 flex flex-col overflow-hidden'>
        <header className='md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200'>
          <div className='flex items-center gap-2'>
            <Heart className='w-6 h-6 text-blue-600' />
            <span className='font-bold text-lg text-blue-600'>MindTrack</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className='h-6 w-6' />
          </button>
        </header>
        
        <main className='flex-1 overflow-y-auto'>
          {children}
        </main>
      </div>
    </div>
  )
}
