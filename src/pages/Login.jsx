import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Heart } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4'>
              <Heart className='w-8 h-8 text-white' />
            </div>
            <h1 className='text-3xl font-bold text-gray-800'>MindTrack</h1>
            <p className='text-gray-600 mt-2'>Track your mental health journey</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='you@example.com'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='••••••••'
                required
              />
            </div>

            {message && (
              <div className={\p-4 rounded-lg \\}>
                <p className='text-sm'>{message}</p>
              </div>
            )}

            <button
              type='submit'
              disabled={isLoading}
              className='w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className='text-sm text-blue-600 hover:text-blue-700'
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
          </div>
        </div>

        <p className='text-center text-sm text-gray-600 mt-6'>
          Free forever • Track unlimited entries • Your data is private
        </p>
      </div>
    </div>
  )
}
