'use client'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

// Tipe untuk proyek
interface Project {
  id: number | string
  name: string
  description: string
  link: string
  image_url: string | null
  user_id: string
  created_at: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [form, setForm] = useState({ name: '', description: '', link: '' })
  const [file, setFile] = useState<File | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // Ambil user dan data proyek
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Gagal ambil user:', error.message)
        return
      }
      if (data?.user) {
        setUserId(data.user.id)
        fetchProjects(data.user.id)
      }
    }
    getUser()
  }, [])

  // Ambil daftar proyek
  const fetchProjects = async (uid: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Gagal ambil proyek:', error.message)
    } else {
      setProjects(data || [])
    }
  }

  // Upload gambar ke Supabase Storage
  const uploadImage = async (): Promise<string | null> => {
    if (!file) return null;

    const filePath = `projects/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase
      .storage
      .from('project-images') // nama bucket harus sama
      .upload(filePath, file, {
        upsert: true // izinkan timpa file
      });

    if (uploadError) {
      throw new Error('Upload gagal: ' + uploadError.message);
    }

    const { data } = supabase
      .storage
      .from('project-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // Hapus proyek
  const handleDelete = async (id: number | string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId) // tambah keamanan: pastikan user_id cocok

    if (error) {
      alert('Gagal menghapus: ' + error.message)
    } else {
      setProjects(projects.filter(p => p.id !== id))
    }
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      alert('User tidak ditemukan. Silakan login ulang.')
      return
    }

    try {
      const imageUrl = await uploadImage()

      const newProject = {
        ...form,
        image_url: imageUrl,
        user_id: userId, // ✅ WAJIB: isi user_id
      }

      const { error } = await supabase
        .from('projects')
        .insert([newProject]) // kirim sebagai array
        .select() // ambil data kembali (opsional)

      if (error) throw error

      // Reset form
      setForm({ name: '', description: '', link: '' })
      setFile(null)
      fetchProjects(userId) // refresh daftar
    } catch (err: any) {
      console.error('Error:', err)
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
            <div key={p.id} className="bg-white rounded-lg overflow-hidden shadow relative">
              {p.image_url && (
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).alt = 'Gambar tidak tersedia'
                  }}
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <p className="text-gray-600">{p.description}</p>
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Lihat →
                  </a>
                )}
                <button
                  onClick={() => handleDelete(p.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition text-sm"
                  aria-label={`Hapus proyek ${p.name}`}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form Tambah Proyek */}
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
              rows={3}
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
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Simpan Proyek
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}