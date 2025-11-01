import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { Plus, TrendingUp, TrendingDown, Activity, Brain, Zap } from 'lucide-react'

export default function Dashboard() {
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('created_by', user.id)
        .order('date', { ascending: false })
        .limit(30)
      
      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error('Error loading entries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAverageMood = () => {
    if (!entries.length) return 0
    return (entries.reduce((sum, entry) => sum + entry.mood_level, 0) / entries.length).toFixed(1)
  }

  const getAverageEnergy = () => {
    if (!entries.length) return 0
    return (entries.reduce((sum, entry) => sum + (entry.energy_level || 0), 0) / entries.length).toFixed(1)
  }

  const getCurrentStreak = () => {
    let streak = 0
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date)
      entryDate.setHours(0, 0, 0, 0)
      const diffDays = Math.round((currentDate - entryDate) / (1000 * 60 * 60 * 24))
      
      if (diffDays === streak) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else if (diffDays === 0) {
        continue
      } else {
        break
      }
    }
    return streak
  }

  if (isLoading) {
    return <div className='p-6'>Loading...</div>
  }

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800'>Welcome back 👋</h1>
          <p className='text-gray-600 mt-2'>
            {entries.length > 0 ? 'Here\'s your mental health journey overview' : 'Start tracking your mental health journey today'}
          </p>
        </div>
        <Link to='/add-entry' className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2'>
          <Plus className='w-4 h-4' />
          Add Entry
        </Link>
      </div>

      {entries.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <Brain className='w-6 h-6 text-blue-600' />
              </div>
            </div>
            <div className='text-3xl font-bold text-gray-800'>{getAverageMood()}/10</div>
            <p className='text-sm text-gray-500 mt-1'>Average Mood</p>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <Zap className='w-6 h-6 text-green-600' />
              </div>
            </div>
            <div className='text-3xl font-bold text-gray-800'>{getAverageEnergy()}/10</div>
            <p className='text-sm text-gray-500 mt-1'>Average Energy</p>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='p-2 bg-purple-100 rounded-lg'>
                <Activity className='w-6 h-6 text-purple-600' />
              </div>
            </div>
            <div className='text-3xl font-bold text-gray-800'>{getCurrentStreak()}</div>
            <p className='text-sm text-gray-500 mt-1'>Day Streak</p>
          </div>
        </div>
      ) : (
        <div className='text-center py-16 bg-white rounded-lg shadow'>
          <div className='w-20 h-20 rounded-full bg-blue-100 mx-auto mb-6 flex items-center justify-center'>
            <Plus className='w-10 h-10 text-blue-600' />
          </div>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>Start Your Journey</h2>
          <p className='text-gray-600 mb-6'>Begin tracking your mood to better understand your mental health patterns.</p>
          <Link to='/add-entry' className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
            <Plus className='w-5 h-5' />
            Add Your First Entry
          </Link>
        </div>
      )}
    </div>
  )
}
