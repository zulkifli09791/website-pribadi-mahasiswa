'use client'
import { useState } from 'react'
import Image from 'next/image'

interface Page {
  image: string
  description: string
  title?: string
  date?: string
}

interface RealisticBookProps {
  pages: Page[]
  semester: string
}

export default function RealisticBook({ pages, semester }: RealisticBookProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = pages.length
  const maxPage = Math.max(0, totalPages - 2)

  const nextPage = () => {
    if (currentPage < maxPage) {
      setCurrentPage(prev => prev + 2)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 2)
    }
  }

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Album Kosong</h3>
          <p className="text-gray-500">Tambahkan foto pertama untuk memulai kenangan!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Album Kenangan
        </h1>
        <p className="text-xl text-gray-600 mt-2">Semester {semester}</p>
      </div>

      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-amber-200/20 to-orange-200/20 blur-3xl rounded-3xl"></div>
        
        <div className="relative bg-gradient-to-b from-amber-50 to-orange-50 p-8 rounded-3xl shadow-2xl">
          <div className="flex gap-4">
            {pages.map((page, index) => (
              <div key={index} className="w-80 h-96 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-64 relative">
                  <Image
                    src={page.image}
                    alt={page.title || `Foto ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{page.title || `Foto ${index + 1}`}</h3>
                  <p className="text-sm text-gray-600 mt-1">{page.description}</p>
                  {page.date && (
                    <p className="text-xs text-gray-400 mt-2">{page.date}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
