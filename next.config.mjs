/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ MATIKAN ESLint saat build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ MATIKAN TypeScript type checking saat build
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Izinkan gambar dari Supabase
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig