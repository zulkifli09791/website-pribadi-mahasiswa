'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { calculateTotalGPA } from '@/lib/ipkUtils'

interface HomeStatsProps {
  userId: string
}

export default function HomeStats({ userId }: HomeStatsProps) {
  const [stats, setStats] = useState({
    projects: 0,
    ipk: 0,
    activities: 0,
    loading: true
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch projects count
        const { count: projectCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)

        // Fetch IPK data
        const { data: ipkData } = await supabase
          .from('ipk')
          .select('*')
          .eq('user_id', userId)

        // Fetch activities count
        const { count: activityCount } = await supabase
          .from('album')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)

        const ipk = ipkData ? calculateTotalGPA(ipkData) : 0

        setStats({
          projects: projectCount || 0,
          ipk: ipk,
          activities: activityCount || 0,
          loading: false
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats(prev => ({ ...prev, loading: false }))
      }
    }

    fetchStats()
  }, [userId])

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  const statsData = [
    { label: 'Total Proyek', value: stats.projects, icon: '💻', color: 'from-blue-500 to-blue-600' },
    { label: 'IPK Terakhir', value: stats.ipk.toFixed(2), icon: '📊', color: 'from-green-500 to-green-600' },
    { label: 'Total Kegiatan', value: stats.activities, icon: '📷', color: 'from-purple-500 to-purple-600' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
