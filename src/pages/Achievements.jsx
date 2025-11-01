import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Trophy } from 'lucide-react'

export default function Achievements() {
  const [achievements] = useState([
    { key: 'FIRST_ENTRY', name: 'First Entry', description: 'Log your first mood entry' },
    { key: 'WEEK_STREAK', name: 'Week Warrior', description: 'Maintain a 7-day streak' },
    { key: 'MONTH_STREAK', name: 'Monthly Master', description: 'Maintain a 30-day streak' },
    { key: 'HUNDRED_ENTRIES', name: 'Century Club', description: 'Log 100 mood entries' }
  ])
  const [unlocked, setUnlocked] = useState([])

  useEffect(() => {
    loadAchievements()
  }, [])

  const loadAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase
        .from('users')
        .select('unlocked_achievements')
        .eq('id', user.id)
        .single()
      
      setUnlocked(data?.unlocked_achievements || [])
    } catch (error) {
      console.error('Error loading achievements:', error)
    }
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>Your Achievements</h1>
      
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {achievements.map((ach) => {
          const isUnlocked = unlocked.includes(ach.key)
          
          return (
            <div
              key={ach.key}
              className={\g-white rounded-lg shadow p-6 text-center \\}
            >
              <div className={\w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center \\}>
                <Trophy className={\w-8 h-8 \\} />
              </div>
              <p className='font-semibold text-sm'>{ach.name}</p>
              <p className='text-xs text-gray-500 mt-1'>{isUnlocked ? ach.description : 'Locked'}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
