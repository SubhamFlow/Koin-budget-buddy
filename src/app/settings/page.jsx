'use client'
import React, { startTransition, useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { useTheme } from '@/context/ThemeContext'
import { useSession } from 'next-auth/react'

const SettingsPage = () => {
  const { darkMode } = useTheme()
  const { data: session } = useSession()
  const [budget, setBudget] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const budgetKey = session?.user?.email
      ? `monthlyBudget:${session.user.email.toLowerCase()}`
      : null
    const stored = budgetKey ? localStorage.getItem(budgetKey) : null
    if (stored) startTransition(() => setBudget(stored))
  }, [session?.user?.email])

  const handleSaveBudget = () => {
    if (budget === '' || Number.isNaN(Number(budget)) || Number(budget) < 0) {
      alert('Please enter a valid monthly budget greater than or equal to 0.')
      return
    }

    const nextBudget = Number(budget).toString()
    const budgetKey = session?.user?.email
      ? `monthlyBudget:${session.user.email.toLowerCase()}`
      : null

    if (!budgetKey) return

    localStorage.setItem(budgetKey, nextBudget)
    setBudget(nextBudget)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = async () => {
    const confirmed = confirm('This will delete all your logged expenses. Are you sure?')
    if (!confirmed) return

    try {
      const response = await fetch('/api/expenses/reset', { method: 'DELETE' })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Could not reset your data.')
      }

      alert('All expenses cleared.')
    } catch (error) {
      console.error('Reset failed:', error)
      alert('Failed to clear expenses. Please try again.')
    }
  }

  const cardClass = darkMode ? 'bg-gray-900' : 'bg-white'
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500'
  const textMain = darkMode ? 'text-white' : 'text-gray-900'
  const inputClass = darkMode
    ? 'w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500'
    : 'w-full rounded-lg border border-gray-200 bg-white text-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500'

  return (
    <div className={darkMode ? 'min-h-screen bg-gray-950' : 'min-h-screen bg-gray-50'}>
      <Navbar />

      <div className="max-w-lg mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className={`text-2xl font-semibold ${textMain}`}>Settings</h1>
          <p className={textMuted}>Manage your account and preferences</p>
        </div>

       <div className={`rounded-xl shadow-sm p-6 ${cardClass}`}>
  <h2 className={`text-lg font-medium mb-3 ${textMain}`}>Profile</h2>
  <div className="flex items-center gap-4 mb-3">
    {session?.user?.image ? (
      <img
        src={session.user.image}
        alt="Profile"
        className="w-14 h-14 rounded-full object-cover"
      />
    ) : (
      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-semibold ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-600'}`}>
        {session?.user?.name?.[0] || '?'}
      </div>
    )}
    <div>
      <p className={`text-sm ${textMuted}`}>Name</p>
      <p className={textMain}>{session?.user?.name || '—'}</p>
    </div>
  </div>
  <p className={`text-sm ${textMuted}`}>Email</p>
  <p className={textMain}>{session?.user?.email || '—'}</p>
</div>

        <div className={`rounded-xl shadow-sm p-6 ${cardClass}`}>
          <h2 className={`text-lg font-medium mb-1 ${textMain}`}>Monthly Budget Goal</h2>
          <p className={`text-sm mb-4 ${textMuted}`}>Set a target so your dashboard can track progress</p>
          <input
            type="number"
            min="0"
            step="0.01"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 10000"
            className={`${inputClass} mb-3`}
          />
          <button
            onClick={handleSaveBudget}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            {saved ? 'Saved ✓' : 'Save Budget'}
          </button>
        </div>

        <div className={`rounded-xl shadow-sm p-6 border ${darkMode ? 'bg-gray-900 border-red-900/50' : 'bg-white border-red-100'}`}>
          <h2 className="text-lg font-medium mb-1 text-red-500">Danger Zone</h2>
          <p className={`text-sm mb-4 ${textMuted}`}>Permanently delete all logged expenses</p>
          <button
            onClick={handleReset}
            className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage