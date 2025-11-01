import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { User, Palette } from 'lucide-react'

export default function Settings() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error loading user:', error)
    }
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold text-gray-800 mb-8'>Settings</h1>
      
      <div className='space-y-6'>
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center gap-2 mb-4'>
            <User className='w-5 h-5 text-blue-600' />
            <h2 className='text-xl font-semibold'>My Profile</h2>
          </div>
          
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
              <input
                type='email'
                value={user?.email || ''}
                disabled
                className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50'
              />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center gap-2 mb-4'>
            <Palette className='w-5 h-5 text-blue-600' />
            <h2 className='text-xl font-semibold'>Appearance</h2>
          </div>
          <p className='text-gray-600'>Theme customization coming soon...</p>
        </div>
      </div>
    </div>
  )
}
