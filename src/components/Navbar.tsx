'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import DarkModeToggle from './DarkModeToggle'

export default function Navbar() {
  const path = usePathname()
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getUser()
      setSession(data.user)
    }

    getInitialSession()

    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    }) 

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe()
      }
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (!session) return null // Sembunyikan navbar jika belum login

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Website Pribadi</span>
        <div className="flex space-x-6 items-center">
          {[
            { href:'/home', label:'Home'},
            { href: '/projects', label: 'Proyek' },
            { href: '/ipk', label: 'IPK' },
            { href: '/album', label: 'Album' },
            { href: '/about', label: 'Tentang' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-blue-600 dark:hover:text-blue-400 ${
                path === item.href ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <DarkModeToggle />
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline text-sm dark:text-red-400"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
