'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function AlbumPage() {
  const [semesters] = useState([
    { id: 1, name: 'Semester 1', color: 'from-blue-500 to-cyan-500', icon: '📚' },
    { id: 2, name: 'Semester 2', color: 'from-green-500 to-emerald-500', icon: '📖' },
    { id: 3, name: 'Semester 3', color: 'from-purple-500 to-pink-500', icon: '📝' },
    { id: 4, name: 'Semester 4', color: 'from-orange-500 to-red-500', icon: '📊' },
    { id: 5, name: 'Semester 5', color: 'from-indigo-500 to-blue-500', icon: '📈' },
    { id: 6, name: 'Semester 6', color: 'from-teal-500 to-green-500', icon: '📋' },
    { id: 7, name: 'Semester 7', color: 'from-rose-500 to-pink-500', icon: '📑' },
    { id: 8, name: 'Semester 8', color: 'from-amber-500 to-orange-500', icon: '📜' },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 bg-clip-text text-transparent mb-4">
            📸 Album Kenangan
          </h1>
          <p className="text-xl text-gray-600">Kenangan indah setiap semester kuliah</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {semesters.map((semester) => (
            <Link
              key={semester.id}
              href={`/album/${semester.id}`}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${semester.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
              
              <div className="relative p-8 text-center text-white">
                <div className="text-6xl mb-4">{semester.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{semester.name}</h3>
                <p className="text-sm opacity-90">Klik untuk melihat kenangan</p>
                
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                  <span className="text-white font-semibold">Buka Album →</span>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Setiap semester adalah bab baru dalam perjalanan kuliah Anda
          </p>
        </div>
      </div>
    </div>
  )
}
