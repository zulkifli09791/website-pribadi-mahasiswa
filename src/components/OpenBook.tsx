'use client'
import { useState } from 'react'

interface Page {
  image: string
  description: string
}

interface OpenBookProps {
  pages: Page[]
}

export default function OpenBook({ pages }: OpenBookProps) {
  const [currentPage, setCurrentPage] = useState(0)

  // Hitung jumlah pasangan halaman (kiri & kanan)
  const totalPages = pages.length
  const maxPage = Math.max(0, totalPages - 2) // -2 karena dua halaman per spread

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

  // Ambil halaman kiri dan kanan
  const leftPage = pages[currentPage]
  const rightPage = pages[currentPage + 1]

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-white rounded-lg shadow">
        <p className="text-gray-500">Belum ada foto</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      {/* Tombol Navigasi */}
      <div className="flex justify-between w-full max-w-4xl mb-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          ← Sebelumnya
        </button>
        <span className="px-4 py-2 text-gray-600">
          Halaman {currentPage + 1} - {Math.min(currentPage + 2, totalPages)} dari {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage >= maxPage}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Selanjutnya →
        </button>
      </div>

      {/* Buku Terbuka */}
      <div
        className="flex justify-center gap-2"
        style={{
          perspective: '2000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Halaman Kiri */}
        {leftPage && (
          <div
            className="relative w-64 h-96 transform-gpu"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              className="absolute inset-0 transition-transform duration-700 ease-in-out transform hover:rotate-y-2"
              style={{
                transform: 'rotateY(0deg)',
                transformStyle: 'preserve-3d',
                boxShadow: 'inset -10px 0 10px -5px rgba(0,0,0,0.2)',
              }}
            >
              <img
                src={leftPage.image}
                alt="Halaman Kiri"
                className="w-full h-full object-cover rounded-r-none rounded-lg shadow-lg"
              />
              <div className="absolute bottom-0 p-4 bg-white bg-opacity-80 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-2">Deskripsi</h3>
                <p className="text-gray-600">{leftPage.description || 'Tanpa deskripsi'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Halaman Kanan */}
        {rightPage && (
          <div
            className="relative w-64 h-96 transform-gpu"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              className="absolute inset-0 transition-transform duration-700 ease-in-out transform hover:rotate-y-2"
              style={{
                transform: 'rotateY(0deg)',
                transformStyle: 'preserve-3d',
                boxShadow: 'inset 10px 0 10px -5px rgba(0,0,0,0.2)',
              }}
            >
              <img
                src={rightPage.image}
                alt="Halaman Kanan"
                className="w-full h-full object-cover rounded-l-none rounded-lg shadow-lg"
              />
              <div className="absolute bottom-0 p-4 bg-white bg-opacity-80 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-2">Deskripsi</h3>
                <p className="text-gray-600">{rightPage.description || 'Tanpa deskripsi'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}