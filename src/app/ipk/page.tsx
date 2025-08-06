'use client'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { calculateSemesterGPA, calculateTotalGPA } from '@/lib/ipkUtils'

export default function IPKPage() {
  const [semesters, setSemesters] = useState<any[][]>(Array(8).fill(null).map(() => []))
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUserId(data.user.id)
        fetchIPK(data.user.id)
      }
    }
    getUser()
  }, [])

  const fetchIPK = async (uid: string) => {
    const { data, error } = await supabase
      .from('ipk')
      .select('*')
      .eq('user_id', uid)
      .order('created_at')

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    const newSemesters = Array(8).fill(null).map(() => [])
    data?.forEach((item) => {
      if (item.semester >= 1 && item.semester <= 8) {
        newSemesters[item.semester - 1].push(item)
      }
    })

    setSemesters(newSemesters)
    setLoading(false)
  }

  const addCourse = (semIdx: number) => {
    setSemesters((prev) => {
      const updated = [...prev]
      updated[semIdx].push({ id: null, course: '', credits: 3, grade: 'B' })
      return updated
    })
  }

  const removeCourse = async (semIdx: number, idx: number) => {
    const course = semesters[semIdx][idx]
    if (course.id) {
      await supabase.from('ipk').delete().eq('id', course.id)
    }
    const updated = [...semesters]
    updated[semIdx].splice(idx, 1)
    setSemesters(updated)
  }

  const saveAll = async () => {
    if (!userId) return
    for (let i = 0; i < semesters.length; i++) {
      for (const course of semesters[i]) {
        if (!course.id && course.course) {
          await supabase.from('ipk').insert({
            semester: i + 1,
            course: course.course,
            credits: course.credits,
            grade: course.grade,
            user_id: userId,
          })
        }
      }
    }
    alert('Data IPK berhasil disimpan!')
    fetchIPK(userId)
  }

  if (loading) return <p className="text-center py-10">Memuat...</p>

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-3xl font-bold mb-6">Riwayat Nilai & IPK</h1>
        {semesters.map((courses, semIdx) => (
          <div key={semIdx} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Semester {semIdx + 1}</h2>
            <table className="w-full mb-4">
              <thead>
                <tr className="border-b">
                  <th className="text-left">MK</th>
                  <th className="text-left">SKS</th>
                  <th className="text-left">Nilai</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        value={c.course}
                        onChange={(e) => {
                          const updated = [...semesters]
                          updated[semIdx][idx].course = e.target.value
                          setSemesters(updated)
                        }}
                        className="p-1 border rounded"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={c.credits}
                        onChange={(e) => {
                          const updated = [...semesters]
                          updated[semIdx][idx].credits = parseInt(e.target.value) || 3
                          setSemesters(updated)
                        }}
                        className="p-1 w-16 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        min="1"
                        max="6"
                      />
                    </td>
                    <td>
                      <select
                        value={c.grade}
                        onChange={(e) => {
                          const updated = [...semesters]
                          updated[semIdx][idx].grade = e.target.value
                          setSemesters(updated)
                        }}
                        className="p-1 border rounded"
                      >
                        {['A', 'AB', 'B', 'BC', 'C', 'D', 'E'].map(g => (
                          <option key={g}>{g}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => removeCourse(semIdx, idx)}
                        className="text-red-500 text-sm"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => addCourse(semIdx)}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm mr-2"
            >
              + Tambah MK
            </button>
            <p><strong>IP:</strong> {calculateSemesterGPA(courses).toFixed(2)}</p>
          </div>
        ))}
        <button
          onClick={saveAll}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Simpan Semua
        </button>
        <p className="mt-4 text-xl">
          <strong>IPK Total:</strong> {calculateTotalGPA(semesters.flat()).toFixed(2)}
        </p>
      </div>
    </ProtectedRoute>
  )
}