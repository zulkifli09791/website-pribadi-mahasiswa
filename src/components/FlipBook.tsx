'use client'
import { useState } from 'react'

interface FlipBookProps {
  pages: {
    image: string
    description: string
  }[]
}

export default function FlipBook({ pages }: FlipBookProps) {
  const [flippedIndices, setFlippedIndices] = useState<boolean[]>(pages.map(() => false))

  const toggleFlip = (index: number) => {
    setFlippedIndices((prev) => {
      const newFlipped = [...prev]
      newFlipped[index] = !newFlipped[index]
      return newFlipped
    })
  }

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-white rounded-lg shadow">
        <p className="text-gray-500">Belum ada foto</p>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <div className="flex space-x-4">
        {pages.map((page, index) => (
          <div
            key={index}
            className="relative w-64 h-96 preserve-3d cursor-pointer"
            onClick={() => toggleFlip(index)}
            style={{ perspective: '1000px' }}
          >
            <div
              className={`absolute w-full h-full backface-hidden transition-transform duration-700 ease-in-out transform ${
                flippedIndices[index] ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Halaman Depan (Gambar) */}
              <div
                className="absolute w-full h-full backface-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                }}
              >
                <img
                  src={page.image}
                  alt="Foto"
                  className="w-full h-full object-cover rounded-lg shadow"
                />
              </div>

              {/* Halaman Belakang (Deskripsi) */}
              <div
                className="absolute w-full h-full backface-hidden bg-gray-50 rounded-lg p-4 flex items-center"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <p className="text-center text-gray-700">{page.description || 'Tanpa deskripsi'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}