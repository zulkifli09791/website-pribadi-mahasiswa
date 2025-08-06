'use client'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', description: '', link: '' })
  const [file, setFile] = useState<File | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUserId(data.user.id)
        fetchProjects(data.user.id)
      }
    }
    getUser()
  }, [])

  const fetchProjects = async (uid: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
    if (!error) setProjects(data || [])
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!file) return null
    const filePath = `projects/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('project-images').upload(filePath, file)
    if (error) throw error
    const { data } = supabase.storage.from('project-images').getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    try {
      const imageUrl = await uploadImage()
      const { error } = await supabase.from('projects').insert({
        ...form,
        image_url: imageUrl,
        user_id: userId,
      })
      if (error) throw error

      setForm({ name: '', description: '', link: '' })
      setFile(null)
      fetchProjects(userId)
    } catch (err: any) {
      alert('Gagal: ' + err.message)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Proyek Saya</h1>

        {/* Daftar Proyek */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {projects.map((p) => (
            <div key={p.id} className="bg-white rounded-lg overflow-hidden shadow">
              {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-48 object-cover" />}
              <div className="p-4">
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <p className="text-gray-600">{p.description}</p>
                {p.link && <a href={p.link} target="_blank" rel="noopener" className="text-blue-600">Lihat →</a>}
              </div>
            </div>
          ))}
        </div>

        {/* Form Input di Bawah */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Tambah Proyek Baru</h2>
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Nama Proyek"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border rounded mb-3"
              required
            />
            <textarea
              placeholder="Deskripsi"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-2 border rounded mb-3"
              required
            />
            <input
              placeholder="Link (GitHub/Demo)"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mb-3"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Simpan Proyek
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}