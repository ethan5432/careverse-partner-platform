/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone build for Docker deployments
  output: 'standalone',
  // Keep webpack config — Turbopack is not supported on all platforms
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  },
};

module.exports = nextConfig;