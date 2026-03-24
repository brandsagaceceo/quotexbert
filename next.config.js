/** @type {import('next').NextConfig} */
const nextConfig = {
  // Domain redirects - ensure apex domain redirects to www
  async redirects() {
    return [
      // Apex → www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'quotexbert.com',
          },
        ],
        destination: 'https://www.quotexbert.com/:path*',
        permanent: true,
      },
      // Legacy contractor landing page → canonical join page
      {
        source: '/for-contractors',
        destination: '/contractors/join',
        permanent: true,
      },
    ];
  },
  // Cache-control headers — prevent stale mobile/PWA caches from serving old pages
  async headers() {
    return [
      {
        // HTML pages: always revalidate, never serve stale
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, must-revalidate',
          },
        ],
      },
      {
        // Static assets: cache aggressively (content-hashed filenames)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: '**.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      },
      {
        protocol: 'https',
        hostname: '**.blob.core.windows.net',
      },
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // Optimize production bundles
  experimental: {
    optimizePackageImports: ['lucide-react', '@clerk/nextjs', 'date-fns'],
  },
  // Completely disable linting
  webpack: (config, { isServer }) => {
    // Disable ESLint plugin
    config.plugins = config.plugins.filter(
      (plugin) => plugin.constructor.name !== 'ESLintWebpackPlugin'
    );
    return config;
  },
};

module.exports = nextConfig;
