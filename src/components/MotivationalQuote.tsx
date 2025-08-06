'use client'
import { useState, useEffect } from 'react'

const quotes = [
  "Jangan pernah menyerah, karena kegagalan adalah kesuksesan yang tertunda.",
  "Kesuksesan adalah hasil dari persiapan, kerja keras, dan belajar dari kegagalan.",
  "Berani mencoba adalah langkah pertama menuju keberhasilan.",
  "Setiap hari adalah kesempatan baru untuk menjadi lebih baik.",
  "Kerja keras mengalahkan bakat ketika bakat tidak bekerja keras.",
  "Jangan takut gagal, takutlah untuk tidak mencoba.",
  "Kesempatan tidak datang dua kali, manfaatkan dengan sebaik-baiknya.",
  "Keberhasilan dimulai dari mimpi yang besar dan usaha yang konsisten.",
  "Jadilah pribadi yang selalu belajar dan berkembang.",
  "Motivasi terbesar datang dari dalam diri sendiri."
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState('')

  useEffect(() => {
    const today = new Date().getDate()
    setQuote(quotes[today % quotes.length])
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center italic text-gray-700 dark:text-gray-300">
      <p>"{quote}"</p>
    </div>
  )
}
