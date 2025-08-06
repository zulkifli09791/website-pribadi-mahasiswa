'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string
    link: string
    image_url?: string
  }
  onUpdate: () => void
}

export default function ProjectCard({ project, onUpdate }: ProjectCardProps) {
  const [loadingDelete, setLoadingDelete] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus proyek ini?')) return
    setLoadingDelete(true)
    const { error } = await supabase.from('projects').delete().eq('id', project.id)
    if (error) {
      alert('Gagal menghapus proyek: ' + error.message)
    } else {
      onUpdate()
    }
    setLoadingDelete(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {project.image_url && (
        <img 
          src={project.image_url} 
          alt={project.name} 
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" 
        />
      )}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{project.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 flex-grow text-sm">{project.description}</p>
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Lihat Proyek →
          </a>
        )}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleDelete}
            disabled={loadingDelete}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm disabled:opacity-50"
          >
            {loadingDelete ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}
