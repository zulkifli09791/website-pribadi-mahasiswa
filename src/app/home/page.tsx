'use client'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import HomeStats from '@/components/HomeStats'
import MotivationalQuote from '@/components/MotivationalQuote'

export default function HomePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUserEmail(data.user.email)
        setUserId(data.user.id)
      }
    }
    fetchUser()
  }, [])

  const username = userEmail?.split('@')[0] || 'Mahasiswa'

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile image removed as per user request */}
            {/* Profile image removed as per user request */}
            {/* <Image
              src="/assets/profile.jpg"
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full border-4 border-white shadow-lg"
            /> */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Halo, {username}!</h1>
              <p className="text-lg opacity-90 mb-2">Selamat datang di Website pribadi Anda</p>
              <p className="opacity-80 max-w-lg">
                Di sini Anda bisa menyimpan proyek, nilai IPK, dan kenangan tiap semester dengan mudah.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {userId && <HomeStats userId={userId} />}

        {/* Motivational Quote */}
        <div className="mb-8">
          <MotivationalQuote />
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Proyek', href: '/projects', icon: '💻', description: 'Kelola proyek Anda' },
            { name: 'IPK', href: '/ipk', icon: '📊', description: 'Hitung nilai IPK' },
            { name: 'Album', href: '/album', icon: '📷', description: 'Kenangan semester' },
            { name: 'Tentang', href: '/about', icon: 'ℹ️', description: 'Profil pribadi' },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 block"
            >
              <div className="text-center">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/projects"
              className="bg-blue-500 text-white px-4 py-3 rounded-lg text-center hover:bg-blue-600 transition-colors"
            >
              Tambah Proyek Baru
            </a>
            <a
              href="/ipk"
              className="bg-green-500 text-white px-4 py-3 rounded-lg text-center hover:bg-green-600 transition-colors"
            >
              Input Nilai
            </a>
            <a
              href="/album"
              className="bg-purple-500 text-white px-4 py-3 rounded-lg text-center hover:bg-purple-600 transition-colors"
            >
              Upload Foto
            </a>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
