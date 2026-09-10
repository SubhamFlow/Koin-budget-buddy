'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Wallet } from 'lucide-react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { signOut } from 'next-auth/react'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { darkMode, setDarkMode } = useTheme()

  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Add Expense', path: '/expense' },
    { name: 'History', path: '/history' },
    { name: 'Settings', path: '/settings' },
  ]
  // const reloadPage = { name: 'Home', path: '/' }

  const isActive = (path) => pathname === path

  return (
    <nav className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'} border-b px-6 py-4 flex items-center justify-between relative shadow-sm`}>
      <div className="flex items-center gap-2">
        <Wallet className="text-emerald-600" size={26} />
        <Link href={links[0].path}>
          <span className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>Koin</span>
        </Link>
      </div>

      <ul className="hidden md:flex gap-8">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.path}
              className={isActive(link.path) ? 'text-green-400' : darkMode ? 'text-white' : 'text-black'}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-green-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
       
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="text-sm bg-red-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
          Log Out
        </button>
        
      </div>

      <button className={darkMode ? 'md:hidden text-white' : 'md:hidden text-slate-800'} onClick={() => setOpen(!open)}>
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <ul className={`absolute top-full left-0 w-full z-1 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'} border-t flex flex-col items-center gap-4 py-4 md:hidden shadow-md z-1`}>
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.path}
                onClick={() => setOpen(false)}
                className={isActive(link.path) ? 'text-green-400' : darkMode ? 'text-white' : 'text-black'}
              >
                {link.name} 
                
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-100'
              }`}
            >
              {darkMode ? (
                <>
                  <Sun className="w-5 h-5 text-green-400" /> Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 text-gray-700" /> Dark Mode
                </>
              )}
            </button>
          </li>
          <li>
            <button onClick={() => signOut({ callbackUrl: '/login' })} className="bg-red-600 text-white px-3 text-sm py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Log Out
            </button>
          </li>
        </ul>
      )}
    </nav>
  )
}

export default Navbar