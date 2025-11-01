import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { Save } from 'lucide-react'

export default function AddEntry() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mood_level: 5,
    energy_level: 5,
    anxiety_level: 5,
    pain_level: 1,
    sleep_quality: 'good',
    notes: '',
    triggers: [],
    strategies_used: [],
    diet_factors: []
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error } = await supabase
        .from('mood_entries')
        .insert([{
          ...formData,
          created_by: user.id
        }])
      
      if (error) throw error
      
      navigate('/')
    } catch (error) {
      console.error('Error saving entry:', error)
      alert('Failed to save entry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMoodEmoji = (level) => {
    if (level <= 2) return '😔'
    if (level <= 4) return '😟'
    if (level <= 6) return '😐'
    if (level <= 8) return '😊'
    return '😄'
  }

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>New Journal Entry</h1>
      
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-semibold mb-4'>Core Metrics</h2>
          
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Date</label>
              <input
                type='date'
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Mood Level: {formData.mood_level} {getMoodEmoji(formData.mood_level)}
              </label>
              <input
                type='range'
                min='1'
                max='10'
                value={formData.mood_level}
                onChange={(e) => setFormData({...formData, mood_level: parseInt(e.target.value)})}
                className='w-full'
              />
              <div className='flex justify-between text-xs text-gray-500'>
                <span>Very Low</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Energy Level: {formData.energy_level}
              </label>
              <input
                type='range'
                min='1'
                max='10'
                value={formData.energy_level}
                onChange={(e) => setFormData({...formData, energy_level: parseInt(e.target.value)})}
                className='w-full'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Anxiety Level: {formData.anxiety_level}
              </label>
              <input
                type='range'
                min='1'
                max='10'
                value={formData.anxiety_level}
                onChange={(e) => setFormData({...formData, anxiety_level: parseInt(e.target.value)})}
                className='w-full'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Sleep Quality</label>
              <select
                value={formData.sleep_quality}
                onChange={(e) => setFormData({...formData, sleep_quality: e.target.value})}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              >
                <option value='poor'>Poor</option>
                <option value='fair'>Fair</option>
                <option value='good'>Good</option>
                <option value='excellent'>Excellent</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32'
                placeholder='How are you feeling today?'
              />
            </div>
          </div>
        </div>

        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50'
          >
            <Save className='w-4 h-4' />
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </form>
    </div>
  )
}
