import type { NextConfig } from 'next'

// Rewrites попадают в routes-manifest на этапе build, поэтому нужен дефолт:
// в docker (dev и prod) бэкенд доступен по имени сервиса.
const API_URL = process.env.API_URL ?? 'http://backend:4000'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${API_URL}/uploads/:path*`,
      },
    ]
  },
}

export default nextConfig
