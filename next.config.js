/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
