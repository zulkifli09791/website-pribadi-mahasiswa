'use client'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import PhotoCard from '@/components/PhotoCard'

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

  const handleDelete = async (photo: { image: string; description: string }) => {
  if (!confirm('Apakah Anda yakin ingin menghapus foto ini?')) return;

  const imagePath = photo.image?.split('/album-photos/')?.[1];
  if (!imagePath) {
    alert('Gagal menghapus: path gambar tidak valid');
    return;
  }

  const fullPath = `album-photos/${semester}/${imagePath}`;

  // 1. Hapus dari Supabase Storage
  const { error: storageError } = await supabase.storage
    .from('album-photos')
    .remove([fullPath]);

  if (storageError) {
    alert('Gagal hapus dari storage: ' + storageError.message);
    return;
  }

  // 2. Hapus dari database (tabel `album`)
  const { error: dbError } = await supabase
    .from('album')
    .delete()
    .eq('image_url', photo.image)
    .eq('user_id', userId)
    .eq('semester', semester);

  if (dbError) {
    alert('Gagal hapus dari database: ' + dbError.message);
    return;
  }

  // 3. Update state
  setPhotos(photos.filter(p => p.image !== photo.image));
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 bg-clip-text text-transparent mb-2">
            Album Semester {semester}
          </h1>
          <p className="text-gray-600">Kenangan indah perjalanan kuliah semester {semester}</p>
        </div>

        {/* Grid Foto */}
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {photos.map((photo, index) => (
              <PhotoCard
                key={index}
                image={photo.image}
                description={photo.description}
                alt={`Foto ${index + 1} - ${photo.description}`}
                onDelete={() => handleDelete(photo)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum ada foto</h3>
            <p className="text-gray-500">Tambahkan foto kenangan Anda untuk semester ini</p>
          </div>
        )}

        {/* Form Input */}
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">Tambah Foto Baru</h2>
          <div className="space-y-4">
            <textarea
              placeholder="Deskripsi foto (ceritakan momen ini...)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG (max. 5MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
            {file && (
              <div className="text-sm text-gray-600">
                File dipilih: {file.name}
              </div>
            )}
            <button
              onClick={uploadPhoto}
              disabled={!file}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
            >
              Upload Foto
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}