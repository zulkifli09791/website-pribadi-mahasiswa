'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface ProjectEditFormProps {
  project: {
    id: string
    name: string
    description: string
    link: string
    image_url?: string
  }
  onSave: () => void
  onCancel: () => void
}

export default function ProjectEditForm({ project, onSave, onCancel }: ProjectEditFormProps) {
  const [form, setForm] = useState({
    name: project?.name || '',
    description: project?.description || '',
    link: project?.link || '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = project?.image_url
      if (file) {
        const filePath = `projects/${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, file)
        if (uploadError) throw uploadError
        const { data } = supabase.storage.from('project-images').getPublicUrl(filePath)
        imageUrl = data.publicUrl
      }

      const { error } = await supabase.from('projects').update({
        ...form,
        image_url: imageUrl,
      }).eq('id', project.id)

      if (error) throw error

      setForm({ name: '', description: '', link: '' })
      setFile(null)
      onSave()
    } catch (err: any) {
      alert('Gagal: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Edit Proyek</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nama Proyek"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-700"
          required
        />
        <textarea
          placeholder="Deskripsi"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-700"
          required
        />
        <input
          type="url"
          placeholder="Link (GitHub/Demo)"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-700"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-3"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan Proyek
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Batal
        </button>
      </form>
    </div>
  )
}
