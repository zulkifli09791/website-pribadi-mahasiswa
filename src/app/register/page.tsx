'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      alert(error.message)
    } else {
      alert('Pendaftaran berhasil! Silakan cek email untuk verifikasi.')
      router.push('/login')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Daftar Akun</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mb-4 border rounded dark:bg-gray-700"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mb-4 border rounded dark:bg-gray-700"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded disabled:opacity-70"
        >
          {loading ? 'Mendaftar...' : 'Daftar'}
        </button>
      </form>
      <p className="mt-4 text-center">
        Sudah punya akun?{' '}
        <a href="/login" className="text-blue-600">Login di sini</a>
      </p>
    </div>
  )
}