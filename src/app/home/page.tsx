'use client'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'

export default function HomePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUserEmail(data.user.email)
      }
    }
    fetchUser()
  }, [])

  const username = userEmail?.split('@')[0] || 'Mahasiswa'

  return (
    <ProtectedRoute>
      <div className="text-center max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12 mb-12">
          <Image
            src="/assets/profile.jpg"
            alt="Profile"
            width={120}
            height={120}
            className="rounded-full mx-auto mb-4 border-4 border-white"
          />
          <h1 className="text-4xl font-bold">Halo, {username}!</h1>
          <p className="text-lg mt-2">Selamat datang di portofolio pribadi Anda</p>
          <p className="mt-4 max-w-lg mx-auto opacity-90">
            Di sini Anda bisa mengelola proyek, nilai IPK, dan kenangan tiap semester.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Proyek', href: '/projects', icon: '💻' },
            { name: 'IPK', href: '/ipk', icon: '📊' },
            { name: 'Album', href: '/album', icon: '📷' },
            { name: 'Tentang', href: '/about', icon: 'ℹ️' },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1 block"
            >
              <div className="text-4xl mb-2">{item.icon}</div>
              <h3 className="text-xl font-semibold">{item.name}</h3>
            </a>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  )
}