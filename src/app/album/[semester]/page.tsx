'use client'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import OpenBook from '@/components/OpenBook'

export default function SemesterAlbum() {
  const params = useParams()
  const semester = params.semester as string

  const [photos, setPhotos] = useState<{ image: string; description: string }[]>([])
  const [desc, setDesc] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUserId(data.user.id)
        fetchPhotos(data.user.id)
      }
    }
    getUser()
  }, [semester])

  const fetchPhotos = async (uid: string) => {
    const { data, error } = await supabase
      .from('album')
      .select('*')
      .eq('semester', semester)
      .eq('user_id', uid)
      .order('created_at', { ascending: true })

    if (!error && data) {
      const formatted = data.map((p) => ({
        image: p.image_url,
        description: p.description || 'Tanpa deskripsi',
      }))
      setPhotos(formatted)
    }
  }

  const uploadPhoto = async () => {
    if (!file || !userId) return

    const cleanFileName = file.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9\-\.]/g, '')

    const filePath = `album/${semester}/${Date.now()}-${cleanFileName}`
    const { error: uploadError } = await supabase
      .storage
      .from('album-photos')
      .upload(filePath, file)

    if (uploadError) {
      alert('Upload gagal: ' + uploadError.message)
      return
    }

    const { data } = supabase.storage.from('album-photos').getPublicUrl(filePath)
    const { error: dbError } = await supabase.from('album').insert({
      semester,
      image_url: data.publicUrl,
      description: desc,
      user_id: userId,
    })

    if (dbError) {
      alert('Gagal simpan: ' + dbError.message)
    } else {
      setDesc('')
      setFile(null)
      fetchPhotos(userId)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Album Semester {semester}</h1>

      {/* Buku Terbuka */}
      <div className="mb-8">
        <OpenBook pages={photos} />
      </div>

      {/* Form Input */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Tambah Foto</h2>
        <textarea
          placeholder="Deskripsi foto"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          rows={2}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-3"
        />
        <button
          onClick={uploadPhoto}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload Foto
        </button>
      </div>
    </div>
  )
}