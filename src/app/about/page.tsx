'use client'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AboutPage() {
  const [data, setData] = useState({
    name: '',
    bio: '',
    email: '',
    instagram: '',
    linkedin: '',
    github: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAbout = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('about')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setData(data)
      }
      setLoading(false)
    }
    loadAbout()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
    .from('about')
    .upsert(
        { user_id: user.id, ...data },
        { onConflict: 'user_id' }
    )

    if (error) {
      alert('Gagal menyimpan: ' + error.message)
    } else {
      alert('Data berhasil disimpan!')
    }
  }

  if (loading) return <p>Memuat...</p>

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto">
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold">{data.name || 'Nama Anda'}</h2>
          <p className="text-gray-600 mt-1">{data.bio || 'Bio belum diisi'}</p>
          <div className="mt-4 space-y-2 text-sm">
            {data.email && <p><strong>Email:</strong> {data.email}</p>}
            {data.instagram && <p><strong>Instagram:</strong> @{data.instagram}</p>}
            {data.linkedin && <p><strong>LinkedIn:</strong> {data.linkedin}</p>}
            {data.github && <p><strong>GitHub:</strong> {data.github}</p>}
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6">Tentang Saya</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block mb-1 font-medium">Nama</label>
            <input
              name="name"
              value={data.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Bio</label>
            <textarea
              name="bio"
              value={data.bio}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              name="email"
              value={data.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Instagram</label>
            <input
              name="instagram"
              value={data.instagram}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">LinkedIn</label>
            <input
              name="linkedin"
              value={data.linkedin}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">GitHub</label>
            <input
              name="github"
              value={data.github}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Simpan
          </button>
        </form>
      </div>
    </ProtectedRoute>
  )
}