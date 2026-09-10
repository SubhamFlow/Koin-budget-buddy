"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { useTheme } from '@/context/ThemeContext'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const categoryColors = {
  Food: 'bg-orange-100 text-orange-700',
  Travel: 'bg-blue-100 text-blue-700',
  Shopping: 'bg-pink-100 text-pink-700',
  Bills: 'bg-red-100 text-red-700',
  Entertainment: 'bg-purple-100 text-purple-700',
  Other: 'bg-gray-100 text-gray-700',
}

const categoryColorsDark = {
  Food: 'bg-orange-500/20 text-orange-400',
  Travel: 'bg-blue-500/20 text-blue-400',
  Shopping: 'bg-pink-500/20 text-pink-400',
  Bills: 'bg-red-500/20 text-red-400',
  Entertainment: 'bg-purple-500/20 text-purple-400',
  Other: 'bg-gray-500/20 text-gray-400',
}

const HistoryPage = () => {
  const { darkMode } = useTheme()
  const { status } = useSession()
  const router = useRouter()
  const [expenses, setExpenses] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status !== 'authenticated') return

    fetch('/api/expenses')
      .then(res => {
        if (!res.ok) throw new Error('Unable to load expenses')
        return res.json()
      })
      .then(data => setExpenses(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to fetch expenses:', err))
  }, [router, status])

  const cardClass = darkMode ? 'bg-gray-900' : 'bg-white'
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500'
  const textMain = darkMode ? 'text-white' : 'text-gray-900'
  const rowBorder = darkMode ? 'border-gray-800' : 'border-gray-100'

  const categories = ['All', ...new Set(expenses.map(e => e.category))]

  const filtered = activeCategory === 'All'
    ? expenses
    : expenses.filter(e => e.category === activeCategory)

  const total = filtered.reduce((sum, e) => sum + Number(e.amount), 0)
  const count = filtered.length
  const avg = count > 0 ? Math.round(total / count) : 0

  const now = new Date()
  const thisWeek = filtered.filter(e => {
    const d = new Date(e.date)
    const diff = (now - d) / (1000 * 60 * 60 * 24)
    return diff <= 7
  }).reduce((sum, e) => sum + Number(e.amount), 0)

  const getTagClass = (category) => {
    const map = darkMode ? categoryColorsDark : categoryColors
    return map[category] || (darkMode ? categoryColorsDark.Other : categoryColors.Other)
  }

  return (
    <div className={darkMode ? 'min-h-screen bg-gray-950' : 'min-h-screen bg-gray-50'}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className={`text-xl sm:text-2xl font-semibold ${textMain}`}>Expense History</h1>
          <p className={`text-sm sm:text-base ${textMuted}`}>All your logged expenses</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className={`rounded-xl shadow-sm p-3 sm:p-4 ${cardClass}`}>
            <p className={`text-xs ${textMuted}`}>Total</p>
            <p className={`text-lg sm:text-xl font-bold ${textMain}`}>₹{total}</p>
          </div>
          <div className={`rounded-xl shadow-sm p-3 sm:p-4 ${cardClass}`}>
            <p className={`text-xs ${textMuted}`}>This Week</p>
            <p className={`text-lg sm:text-xl font-bold ${textMain}`}>₹{thisWeek}</p>
          </div>
          <div className={`rounded-xl shadow-sm p-3 sm:p-4 ${cardClass}`}>
            <p className={`text-xs ${textMuted}`}>Transactions</p>
            <p className={`text-lg sm:text-xl font-bold ${textMain}`}>{count}</p>
          </div>
          <div className={`rounded-xl shadow-sm p-3 sm:p-4 ${cardClass}`}>
            <p className={`text-xs ${textMuted}`}>Average</p>
            <p className={`text-lg sm:text-xl font-bold ${textMain}`}>₹{avg}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={`rounded-xl shadow-sm ${cardClass}`}>
          {filtered.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <p className={`${textMuted} mb-4 text-sm sm:text-base`}>No expenses logged yet</p>
              <Link href="/expense" className="text-emerald-500 font-medium hover:underline text-sm sm:text-base">
                Add your first one
              </Link>
            </div>
          ) : (
            <>
              {/* Table view for sm and up */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className={`text-sm ${textMuted} border-b ${rowBorder}`}>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium">Category</th>
                      <th className="px-6 py-3 font-medium">Note</th>
                      <th className="px-6 py-3 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e) => (
                      <tr key={e._id} className={`border-b ${rowBorder} text-sm`}>
                        <td className={`px-6 py-3 ${textMuted}`}>
                          {new Date(e.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTagClass(e.category)}`}>
                            {e.category}
                          </span>
                        </td>
                        <td className={`px-6 py-3 ${textMuted}`}>{e.note || '—'}</td>
                        <td className={`px-6 py-3 text-right font-medium ${textMain}`}>₹{e.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card list view for mobile */}
              <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map((e) => (
                  <div key={e._id} className={`p-4 border-b ${rowBorder} last:border-b-0`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTagClass(e.category)}`}>
                        {e.category}
                      </span>
                      <span className={`font-medium ${textMain}`}>₹{e.amount}</span>
                    </div>
                    <div className={`flex justify-between text-xs ${textMuted}`}>
                      <span>{e.note || '—'}</span>
                      <span>{new Date(e.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default HistoryPage