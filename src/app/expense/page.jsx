"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const page = () => {
  const { darkMode } = useTheme();
  const router=useRouter()

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const inputClass = darkMode
    ? "w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
    : "w-full rounded-lg border border-gray-200 bg-white text-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500";

  const labelClass = darkMode
    ? "text-sm font-medium text-gray-300 mb-1 block"
    : "text-sm font-medium text-gray-600 mb-1 block";

const handleSubmit = async (e) => {
  e.preventDefault();

  const res = await fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, category, note, date }),
  });

  if (!res.ok) {
    console.error('Failed to save expense');
    return;
  }

  router.push('/dashboard');
};
  return (
    <div
      className={
        darkMode ? "bg-gray-950 min-h-screen" : "bg-gray-50 min-h-screen"
      }
    >
      <Navbar />

      <div className="max-w-lg mx-auto px-4 py-10">
        <h1
          className={`text-2xl font-semibold mb-1 ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          Add Expense
        </h1>
        <p className={darkMode ? "text-gray-400 mb-6" : "text-gray-500 mb-6"}>
          Log what you spent — takes 10 seconds
        </p>

        <form
          onSubmit={handleSubmit}
          className={`rounded-2xl shadow-sm p-6 space-y-5 ${darkMode ? "bg-gray-900" : "bg-white"}`}
        >
          <div>
            <label className={labelClass}>Amount</label>
            <div className="relative">
              <span
                className={
                  darkMode
                    ? "absolute left-4 top-3 text-gray-400"
                    : "absolute left-4 top-3 text-gray-400"
                }
              >
                ₹
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`${inputClass} pl-8`}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Entertainment</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What was it for?"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Add Expense
            </button>
            <Link href='/dashboard'>
            <button
              type="button"
              className={
                darkMode
                  ? "px-5 py-3 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                  : "px-5 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
              }
            >
              Cancel
            </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
