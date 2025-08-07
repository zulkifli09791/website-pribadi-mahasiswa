'use client'
import Image from 'next/image'

interface PhotoCardProps {
  image: string
  description: string
  alt?: string
  onDelete?: () => void; 
}

export default function PhotoCard({ image, description, alt = "Photo", onDelete }: PhotoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative group aspect-w-16 aspect-h-12">
        <Image
          src={image}
          alt={alt}
          width={400}
          height={300}
          className="w-full h-64 object-cover"
          priority
        />
        {onDelete && (
          <button
            onClick={onDelete}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
            aria-label="Hapus foto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M10 18a2 2 0 002 2h0a2 2 0 002-2v0" />
            </svg>
          </button>
        )}
      </div>
      <div className="p-4">
        <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
