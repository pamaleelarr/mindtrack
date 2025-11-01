import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AddEntry from './pages/AddEntry'
import Achievements from './pages/Achievements'
import Settings from './pages/Settings'
import Strategies from './pages/Strategies'
import MedicationHistory from './pages/MedicationHistory'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className='flex items-center justify-center h-screen'>Loading...</div>
  }

  if (!user) {
    return <Login />
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout><Dashboard /></Layout>} />
        <Route path='/add-entry' element={<Layout><AddEntry /></Layout>} />
        <Route path='/achievements' element={<Layout><Achievements /></Layout>} />
        <Route path='/settings' element={<Layout><Settings /></Layout>} />
        <Route path='/strategies' element={<Layout><Strategies /></Layout>} />
        <Route path='/medication' element={<Layout><MedicationHistory /></Layout>} />
      </Routes>
    </Router>
  )
}

export default App
