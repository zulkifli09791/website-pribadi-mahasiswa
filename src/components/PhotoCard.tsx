'use client'
import Image from 'next/image'

interface PhotoCardProps {
  image: string
  description: string
  alt?: string
}

export default function PhotoCard({ image, description, alt = "Photo" }: PhotoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="aspect-w-16 aspect-h-12">
        <Image
          src={image}
          alt={alt}
          width={400}
          height={300}
          className="w-full h-64 object-cover"
          priority
        />
      </div>
      <div className="p-4">
        <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
