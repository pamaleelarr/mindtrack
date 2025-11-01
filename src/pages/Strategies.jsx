import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Lightbulb } from 'lucide-react'

export default function Strategies() {
  const [strategies, setStrategies] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStrategies()
  }, [])

  const loadStrategies = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .eq('created_by', user.id)
        .order('average_effectiveness', { ascending: false })
      
      if (error) throw error
      setStrategies(data || [])
    } catch (error) {
      console.error('Error loading strategies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className='p-6'>Loading...</div>
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold text-gray-800 mb-8'>Strategy Effectiveness</h1>
      
      {strategies.length > 0 ? (
        <div className='space-y-4'>
          {strategies.map((strategy) => (
            <div key={strategy.id} className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-semibold text-lg'>{strategy.name}</p>
                  <p className='text-sm text-gray-500'>{strategy.times_used || 0} uses</p>
                </div>
                <div className='text-right'>
                  <div className='text-2xl font-bold text-blue-600'>
                    {strategy.average_effectiveness ? strategy.average_effectiveness.toFixed(1) : 'N/A'}
                  </div>
                  <p className='text-xs text-gray-500'>Avg Rating</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-16 bg-white rounded-lg shadow'>
          <Lightbulb className='w-16 h-16 mx-auto mb-4 text-gray-300' />
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>No Strategy Data Yet</h2>
          <p className='text-gray-600'>
            Start adding entries and rating your coping strategies to see what works best.
          </p>
        </div>
      )}
    </div>
  )
}
