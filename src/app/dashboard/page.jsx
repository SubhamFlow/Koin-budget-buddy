"use client";

import React, { startTransition, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const { darkMode } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  const [coachAdvice, setCoachAdvice] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return

    const email = session.user.email.toLowerCase()
    const storedBudget = localStorage.getItem(`monthlyBudget:${email}`)
    const currentBudget = storedBudget ? Number(storedBudget) : null

    startTransition(() => setBudget(Number.isFinite(currentBudget) ? currentBudget : null))

    fetch('/api/expenses')
      .then(res => {
        if (!res.ok) throw new Error('Unable to load expenses')
        return res.json()
      })
      .then(async data => {
        const accountExpenses = Array.isArray(data) ? data : []
        setExpenses(accountExpenses)

        if (accountExpenses.length === 0) {
          setCoachAdvice('Add a few expenses and I will spot patterns, compare your spending with your budget, and suggest your next best move.')
          return
        }

        setCoachLoading(true)
        setCoachError('')

        const coachResponse = await fetch('/api/coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expenses: accountExpenses, budget: currentBudget }),
        })
        const coachData = await coachResponse.json()

        if (!coachResponse.ok) throw new Error(coachData.message || 'Unable to load money advice')

        setCoachAdvice(coachData.advice)
      })
      .catch(err => {
        console.error("Failed to load dashboard data:", err)
        setCoachError('Money Coach is unavailable right now. Your expense data is still safe.')
      })
      .finally(() => setCoachLoading(false))
  }, [session, status])

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const recent = expenses.slice(0, 5)

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount)
    return acc
  }, {})

if (status === 'loading') {
  return (
    <div className={darkMode ? "min-h-screen bg-gray-950 flex items-center justify-center" : "min-h-screen bg-gray-50 flex items-center justify-center"}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className={darkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>Loading your dashboard...</p>
      </div>
    </div>
  )
}

  if (!session) {
    return null
  }

  return (
    <div
      className={
        darkMode ? "min-h-screen bg-gray-950" : "min-h-screen bg-gray-50"
      }
    >
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1
            className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            Hey there <span className="text-green-400 text-[30px]">{session?.user?.name || "there"}</span>
            👋
          </h1>
          <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
            Here&apos;s your spending overview
          </p>
          <div
            className={`mt-4 rounded-xl shadow-sm p-6 ${darkMode ? "bg-gray-900" : "bg-white"}`}
          >
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Total spent this month
            </p>
            <p
              className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              ₹{total}
            </p>
          </div>
        </div>

        <div
          className={`mb-8 rounded-xl shadow-sm p-6 ${darkMode ? "bg-gray-900" : "bg-white"}`}
        >
          <h2
            className={`text-lg font-medium mb-4 ${darkMode ? "text-white" : ""}`}
          >
            Spending by Category
          </h2>
          {Object.keys(categoryTotals).length === 0 ? (
            <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              No expenses yet — chart will show up here
            </p>
          ) : (
            <ul className="space-y-2">
              {Object.entries(categoryTotals).map(([cat, amt]) => (
                <li key={cat} className={`flex justify-between text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <span>{cat}</span>
                  <span>₹{amt}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          className={`mb-8 rounded-xl shadow-sm p-6 ${darkMode ? "bg-gray-900" : "bg-white"}`}
        >
          <h2
            className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : ""}`}
          >
            Your Money Coach 🧠
          </h2>
          <p
            className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}
          >
            {coachLoading
              ? 'Reviewing your spending...'
              : coachError || coachAdvice || (budget !== null
                ? `Your monthly budget is ₹${budget}. Add expenses to get personalized advice.`
                : 'Set a budget and add expenses to get personalized advice.')}
          </p>
        </div>

        <div
          className={`mb-8 rounded-xl shadow-sm p-6 ${darkMode ? "bg-gray-900" : "bg-white"}`}
        >
          <h2
            className={`text-lg font-medium mb-4 ${darkMode ? "text-white" : ""}`}
          >
            Recent Expenses
          </h2>
          {recent.length === 0 ? (
            <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              Nothing added yet
            </p>
          ) : (
            <ul className="space-y-2">
              {recent.map((e) => (
                <li key={e._id} className={`flex justify-between gap-3 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <span>{e.category} {e.note ? `— ${e.note}` : ""}</span>
                  <span>₹{e.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link href={'/expense'}><button
          className={`fixed bottom-8 right-8 text-white px-5 py-3 rounded-full shadow-lg ${darkMode ? "bg-emerald-600" : "bg-black"}`}
        >
          + Add Expense
        </button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;