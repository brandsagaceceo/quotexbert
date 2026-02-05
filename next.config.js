/** @type {import('next').NextConfig} */
const nextConfig = {
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
