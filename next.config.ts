import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {

  basePath: isProd ? '/toddyland' : '',
  
  trailingSlash: true,
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
}

export default nextConfig