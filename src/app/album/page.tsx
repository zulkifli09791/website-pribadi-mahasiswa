'use client'
import Link from 'next/link'

export default function AlbumPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Album Kenangan Semester</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {Array.from({ length: 8 }, (_, i) => (
          <Link
            key={i + 1}
            href={`/album/${i + 1}`}
            className="p-6 bg-white rounded-lg shadow text-center hover:shadow-lg transition"
          >
            Semester {i + 1}
          </Link>
        ))}
      </div>
    </div>
  )
}