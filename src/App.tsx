import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Templates from './pages/Templates';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/resume-builder/ResumeBuilder'
import InterviewPrep from './pages/InterviewPrep'
import Subscription from './pages/Subscription'
import Profile from './pages/Profile'
import CoverLetterGenerator from './pages/CoverLetterGenerator'
import ATSOptimization from './pages/ATSOptimization'

function App() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const { user, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setLoading])

  // Apply theme to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/auth/signin" />} 
          />
          <Route 
            path="/resume-builder" 
            element={user ? <ResumeBuilder /> : <Navigate to="/auth/signin" />} 
          />
          <Route 
            path="/interview-prep" 
            element={user ? <InterviewPrep /> : <Navigate to="/auth/signin" />} 
          />
          <Route 
            path="/subscription" 
            element={user ? <Subscription /> : <Navigate to="/auth/signin" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/auth/signin" />} 
          />
          <Route 
            path="/cover-letter" 
            element={user ? <CoverLetterGenerator /> : <Navigate to="/auth/signin" />} 
          />
          <Route 
            path="/ats-optimization" 
            element={user ? <ATSOptimization /> : <Navigate to="/auth/signin" />} 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App