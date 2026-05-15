import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@biaenergy/ui'],
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src'), path.join(process.cwd(), 'src/styles')]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.bia.app', pathname: '/**' },
      { protocol: 'https', hostname: 'www.dev.bia.app', pathname: '/**' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com', pathname: '/**' }
    ]
  },
  async rewrites() {
    if (!process.env.NEXT_PUBLIC_BACKEND_URL) return [];
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/fonts/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' }
        ]
      }
    ];
  }
};

export default nextConfig;
