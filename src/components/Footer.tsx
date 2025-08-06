'use client'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const path = usePathname()
  if (path === '/') return null // Sembunyikan di landing

  return (
    <footer className="bg-white py-6 text-center text-sm text-gray-500 border-t">
      &copy; {new Date().getFullYear()} Website Pribadi Mahasiswa
    </footer>
  )
}