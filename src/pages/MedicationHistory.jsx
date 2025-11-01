import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Pill } from 'lucide-react'

export default function MedicationHistory() {
  const [changes, setChanges] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadChanges()
  }, [])

  const loadChanges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('medication_changes')
        .select('*')
        .eq('created_by', user.id)
        .order('date', { ascending: false })
      
      if (error) throw error
      setChanges(data || [])
    } catch (error) {
      console.error('Error loading medication changes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className='p-6'>Loading...</div>
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>Medication History</h1>
      
      {changes.length > 0 ? (
        <div className='space-y-4'>
          {changes.map((change) => (
            <div key={change.id} className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <h3 className='text-lg font-semibold'>{change.medication_name}</h3>
                  <p className='text-sm text-gray-500'>
                    {new Date(change.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <span className='px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full'>
                  {change.change_type.replace('_', ' ')}
                </span>
              </div>
              
              {change.dosage && (
                <p className='text-sm text-gray-600 mb-2'>
                  <strong>Dosage:</strong> {change.dosage}
                </p>
              )}
              
              {change.notes && (
                <p className='text-sm text-gray-700 mt-4 p-3 bg-gray-50 rounded'>
                  {change.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-16 bg-white rounded-lg shadow'>
          <Pill className='w-16 h-16 mx-auto mb-4 text-gray-300' />
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>No Medication Changes</h2>
          <p className='text-gray-600'>
            Log medication changes in your journal entries to track them here.
          </p>
        </div>
      )}
    </div>
  )
}
