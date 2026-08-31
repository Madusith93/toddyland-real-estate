const basePath = '/toddyland'

const nextConfig = {
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  output: 'export',
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,   // required for static export — no server to optimize images on-demand
  },
}

export default nextConfig